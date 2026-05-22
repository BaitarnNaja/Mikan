package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
@Setter
@Getter
@Entity
@Table(name = "cart_item", schema = "mikan_main",
        uniqueConstraints = @UniqueConstraint(
        columnNames = {"session_id", "product_id", "product_option_id"}
))
public class CartItem {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "session_id", nullable = false)
    private UUID sessionId;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "product_option_id")
    private UUID productOptionId;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_option_id", insertable = false, updatable = false)
    private ProductOptional productOption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private ShoppingSession session;

}
