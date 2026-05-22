package com.mikan.restapi.repository;

import com.mikan.restapi.entity.ShoppingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ShoppingSessionRepository extends JpaRepository<ShoppingSession, UUID> {
    Optional<ShoppingSession> findByUserIdAndStatus(UUID userId, String status);
}
