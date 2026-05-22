package com.mikan.restapi.repository;

import com.mikan.restapi.entity.OrderShops;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderShopsRepository extends JpaRepository<OrderShops, UUID> {
    @Query(value = """
    SELECT
        os.id                       AS order_shop_id,
        os.status                   AS status,
        os.created_at               AS created_at,
        (os.subtotal + os.shipping_fee) AS total_amount,
        m.id                        AS shop_id,
        m.shop_name                 AS shop_name,
        oi.id                       AS order_item_id,
        oi.quantity                 AS quantity,
        oi.price                    AS price,
        oi.product_option_id        AS option_id,
        oi.option_name     AS option_name,
        oi.img             AS img,
        oi.product_name    AS product_name,
        CASE
            WHEN po.delete_at IS NOT NULL THEN false
            WHEN p.delete_at IS NOT NULL THEN false
            WHEN po.quantity = 0 THEN false
            ELSE true
        END AS is_available
    FROM mikan_main.order_shops os
    JOIN mikan_main.order_details od  ON os.order_id = od.id
    JOIN mikan_main.merchant m        ON os.merchant_id = m.id
    JOIN mikan_main.order_items oi    ON oi.order_shop_id = os.id
    JOIN mikan_main.product_optional po ON oi.product_option_id = po.id
    JOIN mikan_main.product p           ON po.product_id = p.id
    WHERE od.user_id = :userId
      AND (:shopOrderId IS NULL OR os.id = CAST(:shopOrderId AS uuid))
      AND (:startDate IS NULL OR od.created_at >= CAST(:startDate AS timestamp))
      AND (:endDate IS NULL OR od.created_at <= CAST(:endDate AS timestamp))
    ORDER BY os.created_at DESC
    LIMIT :limit OFFSET :offset
""", nativeQuery = true)
    List<Object[]> findUserOrders(
            @Param("userId") UUID userId,
            @Param("shopOrderId") String shopOrderId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query(value = """
    SELECT COUNT(DISTINCT os.id)
    FROM mikan_main.order_shops os
    JOIN mikan_main.order_details od ON os.order_id = od.id
    WHERE od.user_id = :userId
      AND (:shopOrderId IS NULL OR os.id = CAST(:shopOrderId AS uuid))
      AND (:startDate IS NULL OR od.created_at >= CAST(:startDate AS timestamp))
      AND (:endDate IS NULL OR od.created_at <= CAST(:endDate AS timestamp))
""", nativeQuery = true)
    int countUserOrders(
            @Param("userId") UUID userId,
            @Param("shopOrderId") String shopOrderId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

    @Query(value = """
    SELECT
        os.id                       AS order_shop_id,
        os.status                   AS status,
        os.created_at               AS created_at,
        os.subtotal                 AS subtotal,
        os.shipping_fee             AS shipping_fee,
        os.shipping_carrier         AS carrier,
        os.tracking_number          AS tracking_number,
        m.id                        AS shop_id,
        m.shop_name                 AS shop_name,
        oi.quantity                 AS quantity,
        oi.price                    AS price,
        oi.product_option_id        AS option_id,
        oi.option_name     AS option_name,
        oi.img             AS img,
        oi.product_name    AS product_name,
        od.shipping_address_snapshot AS shipping_address
    FROM mikan_main.order_shops os
    JOIN mikan_main.order_details od  ON os.order_id = od.id
    JOIN mikan_main.merchant m        ON os.merchant_id = m.id
    JOIN mikan_main.order_items oi    ON oi.order_shop_id = os.id
    WHERE os.id = CAST(:orderShopId AS uuid)
      AND od.user_id = CAST(:userId AS uuid)
""", nativeQuery = true)
    List<Object[]> findOrderDetail(
            @Param("orderShopId") String orderShopId,
            @Param("userId") String userId
    );

    Optional<OrderShops> findByIdAndOrderDetails_Users_Id(UUID orderShopId, UUID userId);
    List<OrderShops> findByOrderDetails_Id(UUID orderDetailId);
}
