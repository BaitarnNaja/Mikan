package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "order_shops", schema = "mikan_main")
public class OrderShops {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee;

    @Column(name = "status")
    private String status;

    @Column(name = "shipping_carrier")
    private String shippingCarrier;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderDetails orderDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;


}
