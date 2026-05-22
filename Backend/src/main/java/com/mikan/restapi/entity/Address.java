package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.catalina.User;

import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "address", schema = "mikan_main")
public class Address {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "firstname")
    private String firstname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "line")
    private String line;

    @Column(name = "road")
    private String road;

    @Column(name = "district")
    private String district;

    @Column(name = "subdistrict")
    private String subdistrict;

    @Column(name = "province")
    private String province;

    @Column(name = "postcode", columnDefinition = "CHAR(5)")
    private String postcode;

    @Column(name = "phone", columnDefinition = "CHAR(10)")
    private String phone;

    @Column(name = "is_default")
    private Boolean isDefault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;


}
