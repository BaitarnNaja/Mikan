package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "order_details", schema = "mikan_main")
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "status")
    private String status;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "total_shipping_fee")
    private BigDecimal totalShippingFee;

    @Column(name = "shipping_address_snapshot",columnDefinition = "json")
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    private String shippingAddressSnapshot;

    @Column(name = "payment_id")
    private UUID paymentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "grand_total decimal")
    private BigDecimal grandTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

}
