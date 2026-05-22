package com.mikan.restapi.service;


import com.mikan.restapi.model.product.request.SearchProductsRequest;
import com.mikan.restapi.model.product.request.SearchProductRequest;
import com.mikan.restapi.model.product.response.AiSearchResponse;
import com.mikan.restapi.model.product.response.SearchProductsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@Slf4j
public class AiService {

    private final RestClient restClient;

    // ฉีด RestClient เข้ามา (ต้องไปตั้ง Bean ใน Config ด้วย)
    public AiService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.baseUrl("https://ai.babybaitarn001.space/").build();
    }
    public SearchProductsResponse AiSearchApi(SearchProductRequest request) {
        // 1. เตรียม Request Body
        SearchProductsRequest externalRequest = buildExternalRequest(request);

        // 2. ยิง API และดัก Error
        AiSearchResponse aiResponse = fetchFromExternalApi(externalRequest);

        // 3. ปั้น Response กลับ (Mapping)
        return mapToInternalResponse(aiResponse, request);
    }

    private SearchProductsRequest buildExternalRequest(SearchProductRequest request) {
        return SearchProductsRequest.builder()
                .query(request.getQ())
                .filter(SearchProductsRequest.Filter.builder()
                        .type(request.getType())
                        .minPrice(request.getMinPrice())
                        .maxPrice(request.getMaxPrice())
                        .isStock(request.getIsStock())
                        .shopType(request.getShopType())
                        .build())
                .sortType(request.getSortType())
                .build();
    }

    private AiSearchResponse fetchFromExternalApi(SearchProductsRequest requestBody) {
        return restClient.post()
                .uri("/search")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                // ดักจับ Error 4xx เช่น 422 Unprocessable Entity
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                    String errorBody = new String(res.getBody().readAllBytes());
                    log.error("External API Client Error: {} - Body: {}", res.getStatusCode(), errorBody);
                    // รวม Status Code เข้าไปใน Message String
                    throw new RuntimeException("ข้อมูลที่ส่งไปไม่ถูกต้อง: " + res.getStatusCode());
                })
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    log.error("External API Server Error: {}", res.getStatusCode());
                    throw new RuntimeException("เซิร์ฟเวอร์ปลายทางขัดข้อง: " + res.getStatusCode());
                })
                .body(AiSearchResponse.class);
    }

    private SearchProductsResponse mapToInternalResponse(AiSearchResponse aiResponse, SearchProductRequest request) {
        if (aiResponse == null || aiResponse.getData() == null) {
            return buildEmptyResponse("No data found");
        }

        // แปลงจาก DataInfo (External) เป็น DataInfo (Internal)
        List<SearchProductsResponse.DataInfo> internalList = aiResponse.getData().stream()
                .map(this::mapToDataInfo)
                .toList();

        return SearchProductsResponse.builder()
                .code("200")
                .message("success")
                .data(SearchProductsResponse.DataRes.builder()
                        .metaData(SearchProductsResponse.MetaData.builder()
                                .total(internalList.size())
                                .limit(request.getLimit())
                                .page(request.getPage())
                                .build())
                        .data(internalList)
                        .build())
                .build();
    }

    private SearchProductsResponse.DataInfo mapToDataInfo(AiSearchResponse.DataInfo externalItem) {
        return SearchProductsResponse.DataInfo.builder()
                .id(externalItem.getId())
                .productName(externalItem.getProductName())
                .img(externalItem.getImg())
                .price(SearchProductsResponse.PriceInfo.builder()
                        .currency(externalItem.getPrice().getCurrency())
                        .amount(externalItem.getPrice().getAmount())
                        .build())
                .build();
    }

    private SearchProductsResponse buildEmptyResponse(String message) {
        return SearchProductsResponse.builder().code("200").message(message).build();
    }
}
