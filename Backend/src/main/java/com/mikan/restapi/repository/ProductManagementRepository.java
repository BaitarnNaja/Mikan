package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductManagementRepository extends JpaRepository<Product, UUID> {
}
