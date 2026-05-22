package com.mikan.restapi.repository;

import com.mikan.restapi.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderItemsRepository extends JpaRepository<OrderItems, UUID> {
}
