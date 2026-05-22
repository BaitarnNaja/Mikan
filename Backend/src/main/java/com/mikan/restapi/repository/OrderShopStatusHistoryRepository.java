package com.mikan.restapi.repository;

import com.mikan.restapi.entity.OrderShopStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderShopStatusHistoryRepository extends JpaRepository<OrderShopStatusHistory, UUID> {
}
