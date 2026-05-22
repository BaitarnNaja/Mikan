package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MerchantRepository extends JpaRepository<Merchant, UUID> {
    Optional<Merchant> findByUsersId(UUID userId);

    @Query(value = """
    SELECT
        m.id                                                        AS shop_id,
        m.shop_name                                                 AS shop_name,
        COUNT(DISTINCT p.id) FILTER (WHERE p.delete_at IS NULL)    AS product_quantity,
        COALESCE(AVG(mr.rating), 0)                                AS rating
    FROM mikan_main.merchant m
    LEFT JOIN mikan_main.product p          ON p.merchant_id = m.id
    LEFT JOIN mikan_main.merchant_reviews mr ON mr.merchant_id = m.id
    WHERE m.id = CAST(:shopId AS uuid)
    GROUP BY m.id, m.shop_name
""", nativeQuery = true)
    Object[] findShopInfo(@Param("shopId") UUID shopId);


}
