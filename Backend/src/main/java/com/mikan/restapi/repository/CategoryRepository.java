package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByMerchant_IdAndIsActiveTrueAndDeleteAtIsNull(UUID merchantId);
}
