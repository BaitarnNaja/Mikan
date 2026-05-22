package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "accounts",schema = "mikan_main")
public class Accounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "uuid", insertable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // นี่คือจุดที่บอกว่าคอลัมน์ใน DB ชื่อ user_id
    private Users user;

    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_account_id")
    private String providerAccountId;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "created_at")
    private LocalDateTime createAt;

}
