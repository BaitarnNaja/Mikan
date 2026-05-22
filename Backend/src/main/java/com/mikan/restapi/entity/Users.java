package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "users",schema = "mikan_main")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "uuid", insertable = false, updatable = false)
    private UUID id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    private String role;

    @Column(name = "status")
    private String status;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "name")
    private String name;

}
