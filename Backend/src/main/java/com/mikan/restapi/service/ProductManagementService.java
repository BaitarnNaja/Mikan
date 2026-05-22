package com.mikan.restapi.service;

import com.mikan.restapi.entity.Merchant;
import com.mikan.restapi.entity.Product;
import com.mikan.restapi.entity.ProductOptional;
import com.mikan.restapi.model.product.request.CreateProductRequest;
import com.mikan.restapi.model.product.response.CreateProductResponse;
import com.mikan.restapi.repository.CategoryRepository;
import com.mikan.restapi.repository.MerchantRepository;
import com.mikan.restapi.repository.ProductManagementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductManagementService {
    private final ProductManagementRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;

    public ProductManagementService(ProductManagementRepository productRepository, MerchantRepository merchantRepository, CategoryRepository categoryRepository){
        this.productRepository = productRepository;
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
    }
    public CreateProductResponse createProduct(String userId, CreateProductRequest request){
        UUID uid = UUID.fromString(userId);
        Optional<Merchant> merchant = merchantRepository.findByUsersId(uid);

        Product product = new Product();
        product.setProductName(request.getName());
        product.setType(request.getType());
        product.setDescription(request.getProductDsc());
        product.setImgs(request.getImgs());
        product.setCreatedAt(LocalDateTime.now());
        product.setMerchant(merchant.get());
        if (request.getCategoryId() != null) {
            product.setCategory(
                    categoryRepository.getReferenceById(request.getCategoryId())
            );
        }

        List<ProductOptional> optionals = request.getOptions().stream().map(option -> {
            ProductOptional p = new ProductOptional();
            p.setCode(option.getCode());
            p.setOptionName(option.getOptionName());
            p.setQuantity(option.getQuantity());
            p.setPrice(option.getPrice());
            p.setImg(option.getImg());
            p.setCreatedAt(LocalDateTime.now());
            p.setProduct(product);
            return p;
        }).toList();

        product.setOptions(optionals);

        Product db = productRepository.save(product);
        return CreateProductResponse.builder()
                .productId(db.getId())
                .optionId(db.getOptions().stream().map(ProductOptional::getId).toList())
                .build();
    }
}
