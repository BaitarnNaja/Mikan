package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "product_optional", schema = "mikan_main")
public class ProductOptional {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "code")
    private String code;

    @Column(name = "option_name")
    private String optionName;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    @Column(name = "img")
    private String img;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "delete_at")
    private LocalDateTime deleteAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
