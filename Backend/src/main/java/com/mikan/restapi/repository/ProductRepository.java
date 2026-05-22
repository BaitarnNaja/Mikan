package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("""
    SELECT p
    FROM Product p
    JOIN p.options po
    WHERE p.deleteAt IS NULL
    AND (:types IS NULL OR p.type IN :types)
    AND (:isStock IS NULL OR 
         (:isStock = true AND po.quantity > 0) OR
         (:isStock = false AND po.quantity = 0)
    )
    GROUP BY p
    HAVING (:minPrice IS NULL OR MIN(po.price) >= :minPrice)
       AND (:maxPrice IS NULL OR MIN(po.price) <= :maxPrice)
    ORDER BY
        CASE WHEN :sortType = 'price_low' THEN MIN(po.price) END ASC,
        CASE WHEN :sortType = 'price_high' THEN MIN(po.price) END DESC
""")
    Page<Product> search(
            @Param("types") List<String> types,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("isStock") Boolean isStock,
            @Param("sortType") String sortType,
            Pageable pageable
    );

    Page<Product> findByDeleteAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN FETCH p.options o
        LEFT JOIN FETCH p.merchant m
        WHERE p.id = :id
        AND p.deleteAt IS NULL
    """)
    Optional<Product> findSpecificProduct(@Param("id") UUID id);

    @Query(value = """
    SELECT
        p.id            AS product_id,
        p.product_name  AS product_name,
        p.imgs          AS imgs,
        MIN(po.price)   AS min_price
    FROM mikan_main.product p
    LEFT JOIN mikan_main.product_optional po ON po.product_id = p.id AND po.delete_at IS NULL
    WHERE p.merchant_id = CAST(:shopId AS uuid)
      AND p.delete_at IS NULL
      AND (:categoryId IS NULL OR p.category_id = CAST(:categoryId AS uuid))
    GROUP BY p.id, p.product_name, p.imgs
    ORDER BY p.created_at DESC
    LIMIT :limit OFFSET :offset
""", nativeQuery = true)
    List<Object[]> findShopProducts(
            @Param("shopId") String shopId,
            @Param("categoryId") String categoryId,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT COUNT(*)
    FROM mikan_main.product p
    WHERE p.merchant_id = CAST(:shopId AS uuid)
      AND p.delete_at IS NULL
      AND (:categoryId IS NULL OR p.category_id = CAST(:categoryId AS uuid))
""", nativeQuery = true)
    int countShopProducts(
            @Param("shopId") String shopId,
            @Param("categoryId") String categoryId
    );

}
