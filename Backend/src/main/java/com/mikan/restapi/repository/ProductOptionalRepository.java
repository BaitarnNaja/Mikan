package com.mikan.restapi.repository;

import com.mikan.restapi.entity.ProductOptional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductOptionalRepository extends JpaRepository<ProductOptional, UUID>{
    @Query("""
        SELECT po FROM ProductOptional po
        JOIN FETCH po.product p
        JOIN FETCH p.merchant m
        WHERE po.id IN :ids
    """)
    List<ProductOptional> findAllWithProductAndMerchant(List<UUID> ids);
}
