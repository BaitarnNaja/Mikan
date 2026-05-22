package com.mikan.restapi.service;

import com.mikan.restapi.entity.Category;
import com.mikan.restapi.entity.Merchant;
import com.mikan.restapi.model.category.request.CreateShopCategoryRequest;
import com.mikan.restapi.model.category.response.CreateShopCategoryResponse;
import com.mikan.restapi.repository.CategoryRepository;
import com.mikan.restapi.repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final MerchantRepository merchantRepository;

    public CategoryService(CategoryRepository categoryRepository, MerchantRepository merchantRepository){
        this.categoryRepository = categoryRepository;
        this.merchantRepository = merchantRepository;
    }

    public CreateShopCategoryResponse createCategory(String userId, CreateShopCategoryRequest request){
        UUID uid = UUID.fromString(userId);

        Optional<Merchant> merchant = merchantRepository.findByUsersId(uid);

        Category category = new Category();
        category.setName(request.getCategoryName());
        category.setIsActive(request.isActive());
        category.setCreatedAt(LocalDateTime.now());
        category.setMerchant(merchant.get());

        Category db = categoryRepository.save(category);

        return CreateShopCategoryResponse.builder()
                .categoryId(db.getId())
                .build();
    }
}
