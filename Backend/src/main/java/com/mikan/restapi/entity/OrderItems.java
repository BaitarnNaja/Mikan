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
@Table(name = "order_items", schema = "mikan_main")
public class OrderItems {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "img")
    private String img;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_shop_id", nullable = false)
    private OrderShops orderShops;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_option_id", nullable = false)
    private ProductOptional productOptional;
}
