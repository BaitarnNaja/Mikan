package com.mikan.restapi.repository;

import com.mikan.restapi.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, UUID> {
}
