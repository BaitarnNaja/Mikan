package com.mikan.restapi.repository;

import com.mikan.restapi.entity.CartItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findBySessionIdAndProductIdAndProductOptionId(UUID sessionId, UUID productId, UUID productOptionId);

    @Query(value = """
    SELECT
      m.id as shop_id,
      m.shop_name,
      p.id as product_id,
      p.product_name,
      ci.id as cart_item_Id,
      o.id as option_id,
      o.option_name,
      o.img as image,
      o.price as amount,
      ci.quantity as quantity
    FROM mikan_main.cart_item ci
    JOIN mikan_main.product p ON ci.product_id = p.id
    JOIN mikan_main.merchant m ON p.merchant_id = m.id
    LEFT JOIN mikan_main.product_optional o ON ci.product_option_id = o.id
    WHERE ci.session_id = :sessionId
""", nativeQuery = true)
    List<Object[]> getCartRaw(UUID sessionId);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE mikan_main.cart_item
        SET quantity = :quantity
        WHERE id = :id AND session_id = :sessionId
    """, nativeQuery = true)
    int updateQuantity(UUID id, UUID sessionId, Integer quantity);


    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM mikan_main.cart_item
        WHERE id = :id AND session_id = :sessionId
    """, nativeQuery = true)
    int deleteItem(UUID id, UUID sessionId);

    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM mikan_main.cart_item
        WHERE id IN :ids AND session_id = :sessionId
    """, nativeQuery = true)
    int deleteItems(List<UUID> ids, UUID sessionId);

    int countBySessionId(UUID sessionId);

    @Query("""
        SELECT ci FROM CartItem ci
        JOIN FETCH ci.productOption po
        JOIN FETCH po.product p
        JOIN FETCH p.merchant m
        JOIN FETCH ci.session s
        WHERE ci.id IN :ids
        AND s.user.id = :userId
    """)
    List<CartItem> findSelectedItems(List<UUID> ids, UUID userId);

    void deleteBySessionIdAndProductOptionIdAndQuantity(UUID sessionId, UUID productOptionId, Integer quantity);
}
