from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal, getcontext

class SearchFilter(BaseModel):
    type: Optional[List[str]] = None
    minPrice: Optional[Decimal] = None
    maxPrice: Optional[Decimal] = None
    isStock: Optional[bool] = None
    shopType: Optional[List[str]] = None
    
    def is_empty(self) -> bool:
        """เช็ค filter ทุกตัวว่าไม่มีข้อมูลที่ใช้งานได้จริงส่งมาเลยหรือไม่"""
        type_is_empty = not any(t.strip() for t in (self.type or []) if t)
        shop_type_is_empty = not any(s.strip() for s in (self.shopType or []) if s)
        min_price_is_empty = self.minPrice is None
        max_price_is_empty = self.maxPrice is None
        is_stock_is_empty = self.isStock is None
        return all([
            type_is_empty,
            shop_type_is_empty,
            min_price_is_empty,
            max_price_is_empty,
            is_stock_is_empty
        ])

class SearchRequest(BaseModel):
    query: str
    filter: SearchFilter
    sortType: Optional[str] = ""
    threshold: float = 0.7