package com.mikan.restapi.service;

import com.mikan.restapi.entity.Product;
import com.mikan.restapi.entity.ProductOptional;
import com.mikan.restapi.model.Metadata;
import com.mikan.restapi.model.product.request.GetNewProductRequest;
import com.mikan.restapi.model.product.request.SearchProductRequest;
import com.mikan.restapi.model.product.response.GetProductResponse;
import com.mikan.restapi.model.product.response.GetSpecificProductResponse;
import com.mikan.restapi.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public GetProductResponse searchProduct(SearchProductRequest req){

        Pageable pageable = buildPageable(req);

        Page<Product> page = productRepository.search(
                req.getType(),
                req.getMinPrice(),
                req.getMaxPrice(),
                req.getIsStock(),
                req.getSortType(),
                pageable
        );

        return buildResponse(page);
    }

    public GetProductResponse getNewProduct(GetNewProductRequest req){
        Pageable pageable = PageRequest.of(req.getPage()-1, req.getLimit());

        Page<Product> page =
                productRepository.findByDeleteAtIsNullOrderByCreatedAtDesc(pageable);

        return buildResponse(page);
    }

    public GetSpecificProductResponse getSpecificProduct(UUID uuid){
        Optional<Product> db = productRepository.findSpecificProduct(uuid);

        return GetSpecificProductResponse.builder()
                .id(db.get().getId())
                .productName(db.get().getProductName())
                .description(db.get().getDescription())

                // images
                .images(db.get().getImgs() == null ? List.of() : db.get().getImgs())

                // price (min option)
                .price(
                        GetSpecificProductResponse.Price.builder()
                                .amount(
                                        (db.get().getOptions() == null || db.get().getOptions().isEmpty())
                                                ? 0
                                                : db.get().getOptions().stream()
                                                .filter(o -> o.getDeleteAt() == null)
                                                .mapToDouble(ProductOptional::getPrice)
                                                .min()
                                                .orElse(0)
                                )
                                .currency("THB")
                                .build()
                )

                // option
                .option(
                        db.get().getOptions() == null ? List.of() :
                                db.get().getOptions().stream()
                                        .filter(o -> o.getDeleteAt() == null)
                                        .map(o -> GetSpecificProductResponse.Option.builder()
                                                .id(o.getId())
                                                .optionName(o.getOptionName())
                                                .price(String.valueOf(o.getPrice()))
                                                .quantity(String.valueOf(o.getQuantity()))
                                                .image(o.getImg())
                                                .build()
                                        ).collect(Collectors.toList())
                )

                // merchant
                .merchant(
                        db.get().getMerchant() == null ? null :
                                GetSpecificProductResponse.ProductMerchant.builder()
                                        .id(db.get().getMerchant().getId())
                                        .shopName(db.get().getMerchant().getShopName())
                                        .logImg(db.get().getMerchant().getLogoImg())
                                        .build()
                )

                .build();
    }

    // ===== helper =====

    private GetProductResponse buildResponse(Page<Product> page) {

        List<GetProductResponse.ProductItem> items = page.getContent().stream()
                .map(product -> {
                    Double minPrice = product.getOptions().stream()
                            .map(ProductOptional::getPrice)
                            .min(Double::compareTo)
                            .orElse(0.0);

                    String img = (product.getImgs() != null && !product.getImgs().isEmpty())
                            ? product.getImgs().get(0)
                            : null;

                    return GetProductResponse.ProductItem.builder()
                            .id(product.getId())
                            .productName(product.getProductName())
                            .img(img)
                            .price(GetProductResponse.Price.builder()
                                    .currency("THB")
                                    .amount(minPrice)
                                    .build())
                            .build();
                })
                .toList();

        return GetProductResponse.builder()
                .metadata(Metadata.builder()
                        .total(page.getTotalElements())
                        .limit(page.getSize())
                        .page(page.getNumber())
                        .build())
                .data(items)
                .build();
    }

    public Pageable buildPageable(SearchProductRequest req) {

        Sort sort = Sort.unsorted();

        if (req.getSortType() != null) {
            switch (req.getSortType()) {

                case "new":
                case "date_new":
                    sort = Sort.by("createdAt").descending();
                    break;

                case "date_old":
                    sort = Sort.by("createdAt").ascending();
                    break;

                case "az":
                    sort = Sort.by("productName").ascending();
                    break;

                case "za":
                    sort = Sort.by("productName").descending();
                    break;
            }
        }

        return PageRequest.of(req.getPage() - 1, req.getLimit(), sort);
    }
}
