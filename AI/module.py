import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv

from google import genai
from google.genai import types
import chromadb
from fastapi import FastAPI, HTTPException
from schemas import SearchRequest
from applySort import apply_sorting

import uvicorn

app = FastAPI()
env_path = Path("./.env")
load_dotenv(dotenv_path=env_path)

google_api_key = os.getenv("GOOGLE_API_KEY")
chroma_api_key = os.getenv("CHROMADB_API")

client = genai.Client(api_key=google_api_key)
client_chroma = chromadb.CloudClient(
    api_key=chroma_api_key,
    tenant='f69a80c1-ef1c-467e-be0a-4295c55b5ffb',
    database='Mikan'
)
collection = client_chroma.get_collection(name="new_mock_collection")

search_schema = {
    "type": "OBJECT",
    "properties": {
        "user_full_query": {"type": "STRING"},
        "cleaned_query": {
            "type": "STRING", 
            "description": "The search query after removing filter words like prices, seller names, or categories."
        },
        "max_price": {"type": "INTEGER", "nullable": True},
        "type": {
            "type": "STRING", 
            "enum": ['Acrylic Stand', 'Bag', 'Blind Box', 'Bracelet', 'Cap', 'Comfort Goods', 'Commission', 'Cosplay', 'Digital Art', 'Drinkware', 'Earrings', 'Event Goods', 'Figure', 'Hair Clip', 'Home Decor', 'Jacket', 'Keychain', 'Lifestyle Goods', 'Necklace', 'Phone Strap', 'Photocard', 'Ring', 'Set Collection', 'Socks', 'Stationery', 'Sticker', 'Tote Bag', 'T-shirt', 'Voice Pack', 'VTuber Assets', 'Wallet', 'Wallpaper', '(blank)'],
            "nullable": True
        },
        "seller_name": {"type": "STRING", "nullable": True},
        "stock": {"type": "INTEGER", "nullable": True}
    },
    "required": ["user_full_query", "max_price", "type", "seller_name", "stock"]
}

def get_search_params(user_input):
    """ฟังก์ชัน Agent ที่ทำงานแยก context จาก input เปล่าๆ"""
    prompt = f"""
    Analyze the following user input: '{user_input}'
    1. Extract specific filters (price, type, etc.).
    2. Create a 'cleaned_query' by removing the words that were used as filters. 
       Example: 'อยากได้ฟิกเกอร์ราคาไม่เกิน 500' -> cleaned_query: 'ฟิกเกอร์'
    3. Don't create 'cleaned_query' as 'null' or ''
    """
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=search_schema
        )
    )
    return json.loads(response.text)

def embed_texts(texts: list[str]):
    """ฟังก์ชัน embeding model"""
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=texts
    )
    return [e.values for e in response.embeddings]

def query_chroma_db(search_query, where_filter):
    results = collection.query(
        query_embeddings=embed_texts([search_query]),
        where=where_filter,
        n_results=200
    )
    return results

@app.get("/")
async def read_root():
    return {
        "message": "AI Search Service is running",
        "status": "online",
        "endpoints": {
            "search": "/search (POST)"
        }
    }

@app.post("/search")
async def api_search(request: SearchRequest):
    """API หลักที่ใช้ในการค้นหา"""
    start_time = time.time()
    try:
        if not request.filter.is_empty():
            print("="*30)
            print("Using condition(have filter)")
            print("="*30)
            print(f"User: {request.query}")

            conditions = []
            type_filters = [t.strip() for t in (request.filter.type or []) if t.strip()]
            if type_filters:
                if len(type_filters) > 1:
                    conditions.append({"$or": [{"type": t} for t in type_filters]})
                else:
                    conditions.append({"type": type_filters[0]})

            shop_filters = [s.strip() for s in (request.filter.shopType or []) if s.strip()]
            if shop_filters:
                if len(shop_filters) > 1:
                    conditions.append({"$or": [{"seller_name": s} for s in shop_filters]})
                else:
                    conditions.append({"seller_name": shop_filters[0]})

            if request.filter.minPrice is not None:
                conditions.append({"price": {"$gte": float(request.filter.minPrice)}})
            
            if request.filter.maxPrice is not None:
                conditions.append({"price": {"$lte": float(request.filter.maxPrice)}})

            if request.filter.isStock is not None:
                if request.filter.isStock:
                    conditions.append({"stock": {"$gt": 0}})
                else:
                    conditions.append({"stock": {"$eq": 0}})
            
            if len(conditions) > 1:
                where_filter = {"$and": conditions}
            elif len(conditions) == 1:
                where_filter = conditions[0]
            else:
                where_filter = None
                
            print(f"Filter: {where_filter}")
            results = query_chroma_db(search_query=request.query, where_filter=where_filter)
            final_data = []

            if results and results.get('documents') and results['documents'][0]:
                for i in range(len(results['documents'][0])):
                    score = results['distances'][0][i]
                    
                    if score <= request.threshold:
                        meta = results['metadatas'][0][i]
                        
                        item = {
                            "id": results['ids'][0][i],
                            "productName": results['documents'][0][i],
                            "img": meta.get('image', ''),
                            "price": {
                                "currency": "THB",
                                "amount": meta.get('price', 0)
                            },
                            "score": score
                        }
                        raw_name = item["productName"]
                        clean_name = raw_name.split('\n')[0]
                        clean_name = clean_name.replace("Product:", "").strip()
                        item["productName"] = clean_name
                        final_data.append(item)

            print(f"Sort by: {request.sortType}")
            sort_type = request.sortType or "relevance"
            print(f"Apply sorting type in {sort_type}")
            print("-"*30)

            final_data = apply_sorting(final_data, sort_type)
            total_output_count = len(final_data)
            print(f"Total response: {total_output_count}")

            data_string = json.dumps(final_data, ensure_ascii=False)
            token_response = client.models.count_tokens(
                model="gemini-2.0-flash",
                contents=data_string
            )
            output_tokens = token_response.total_tokens
            
            print(f"Token used: {output_tokens}")

            duration = time.time() - start_time
            return {
                "code": "200",
                "message": request.query,
                "data": final_data,
                "processTime": f"{duration:.4f}s"
            }
        else:
            # 1. วิเคราะห์เจตนา
            params = get_search_params(request.query)
            print("="*30)
            print("Using context model(no filter)")
            print("="*30)
            print(f"User: {params['user_full_query']}")
            
            # 2. เตรียม filter
            user_message = params.get("user_full_query")
            search_query = params.get("cleaned_query")
            print(f"User clean query: {search_query}")
            conditions = []
            if params.get("max_price"): conditions.append({"price": {"$lte": float(params["max_price"])}})
            if params.get("seller_name"): conditions.append({"seller_name": {"$eq": str(params["seller_name"])}})
            if params.get("type"): conditions.append({"type": {"$eq": str(params["type"])}})
            if params.get("stock"): conditions.append({"stock": {"$gt": int(params["stock"])}})

            where_filter = None
            if len(conditions) == 1:
                where_filter = conditions[0]
            elif len(conditions) > 1:
                where_filter = {"$and": conditions}

            print(f"Filter: {where_filter}")
            # 3. Query ChromaDB
            results = query_chroma_db(search_query=search_query, where_filter=where_filter)
            
            # 4. Format Output
            final_data = []

            if results and results.get('documents') and results['documents'][0]:
                for i in range(len(results['documents'][0])):
                    score = results['distances'][0][i]
                    
                    if score <= request.threshold:
                        meta = results['metadatas'][0][i]
                        
                        item = {
                            "id": results['ids'][0][i],
                            "productName": results['documents'][0][i],
                            "img": meta.get('image', ''),
                            "price": {
                                "currency": "THB",
                                "amount": meta.get('price', 0)
                            },
                            "score": score
                        }
                        raw_name = item["productName"]
                        clean_name = raw_name.split('\n')[0]
                        clean_name = clean_name.replace("Product:", "").strip()
                        item["productName"] = clean_name
                        final_data.append(item)

            print(f"Sort by: {request.sortType}")
            sort_type = request.sortType or "relevance"
            print(f"Apply sorting type in {sort_type}")
            print("-"*30)

            final_data = apply_sorting(final_data, sort_type)
            total_output_count = len(final_data)
            print(f"Total response: {total_output_count}")

            data_string = json.dumps(final_data, ensure_ascii=False)
            token_response = client.models.count_tokens(
                model="gemini-2.0-flash",
                contents=data_string
            )
            output_tokens = token_response.total_tokens
            
            print(f"Token used: {output_tokens}")
            
            duration = time.time() - start_time
            return {
                "code": "200",
                "message": user_message,
                "data": final_data,
                "processTime": f"{duration:.4f}s"
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error น้ออออ: {e} ")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001, reload=True)