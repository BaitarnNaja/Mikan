package com.mikan.restapi.controller;

import com.mikan.restapi.constant.ApiResponse;
import com.mikan.restapi.model.product.request.GetNewProductRequest;
import com.mikan.restapi.model.product.request.SearchProductRequest;
import com.mikan.restapi.model.product.response.AiSearchResponse;
import com.mikan.restapi.model.product.response.GetProductResponse;
import com.mikan.restapi.model.product.response.GetSpecificProductResponse;
import com.mikan.restapi.model.product.response.SearchProductsResponse;
import com.mikan.restapi.service.AiService;
import com.mikan.restapi.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;
    private final AiService aiService;

    public ProductController(ProductService productService,AiService aiService) {
        this.productService = productService;
        this.aiService = aiService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<GetProductResponse>> searchProduct(
            @RequestParam(required = false,defaultValue = "1") Integer page,
            @RequestParam(required = false,defaultValue = "12") Integer limit,
            @RequestParam(required = false) List<String> type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean isStock,
            @RequestParam(required = false) List<String> shopType,
            @RequestParam(required = false) String sortType
    ) {

        SearchProductRequest request = new SearchProductRequest();
        request.setPage(page);
        request.setLimit(limit);
        request.setType(type);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setIsStock(isStock);
        request.setShopType(shopType);
        request.setSortType(sortType);
        log.info("[API PRODUCT] search request: {}", request);
        
        GetProductResponse response = productService.searchProduct(request);

        return ResponseEntity.ok(
                ApiResponse.<GetProductResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );

    }

    @GetMapping("/new")
    public ResponseEntity<ApiResponse<GetProductResponse>> getNewProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit
    ){
        GetNewProductRequest request = new GetNewProductRequest();
        request.setPage(page);
        request.setLimit(limit);
        log.info("[API PRODUCT] getNew request: {}", request);

        GetProductResponse response = productService.getNewProduct(request);

        return ResponseEntity.ok(
                ApiResponse.<GetProductResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<GetSpecificProductResponse>> getSpecificProduct(
            @PathVariable UUID productId
    ){
        log.info("[API PRODUCT] getSpecificProduct request: {}", productId );
        GetSpecificProductResponse response = productService.getSpecificProduct(productId);
        return ResponseEntity.ok(
                ApiResponse.<GetSpecificProductResponse>builder()
                        .code("200")
                        .message("success")
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<SearchProductsResponse> searchProducts(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            // ใช้ชื่อ "type[]" เพื่อให้ตรงกับ URL จากฝั่ง Frontend (เช่น PHP/React)
            @RequestParam(value = "type[]", required = false) List<String> type,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "isStock", required = false) Boolean isStock,
            // รับเป็น List<String> Spring จะช่วยแยกค่าที่คั่นด้วยคอมม่าให้โดยอัตโนมัติ
            @RequestParam(value = "shopType", required = false) List<String> shopType,
            @RequestParam(value = "sortType", required = false) String sortType
    ) {

        SearchProductRequest request = new SearchProductRequest();
        request.setQ(q);
        request.setPage(page);
        request.setLimit(limit);
        request.setType(type);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setIsStock(isStock);
        request.setShopType(shopType);
        request.setSortType(sortType);
        log.info("[API PRODUCT] search request: {}", request);

        // จำลองการจัดรูปแบบข้อมูลเพื่อส่งกลับ (ในงานจริงส่งต่อไปยัง Service)
//        Map<String, Object> response = new HashMap<>();
//        response.put("query", q);
//        response.put("page", page);
//        response.put("limit", limit);
//        response.put("selectedTypes", type);
//        response.put("priceRange", String.format("%s - %s", minPrice, maxPrice));
//        response.put("inStockOnly", isStock);
//        response.put("shops", shopType);
//        response.put("sort", sortType);

        SearchProductsResponse response = aiService.AiSearchApi(request);

        return ResponseEntity.ok(response);
    }

}
