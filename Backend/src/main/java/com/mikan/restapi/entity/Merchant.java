package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.poi.hpsf.Decimal;
import org.w3c.dom.Text;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "merchant", schema = "mikan_main")
public class Merchant {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_name")
    private String shopName;

    @Column(name = "logo_img")
    private String logoImg;

    @Column(name = "shop_dsc")
    private String shopDsc;

    @Column(name = "contract_mail")
    private String contractMail;

    @Column(name = "contract_phone")
    private String contractPhone;

    @Column(name = "contract_link")
    private String contractLink;

    @Column(name = "bank_account_id")
    private Long bankAccountId;

    @Column(name = "commission_rate")
    private BigDecimal commissionRate;

    @Column(name = "shipping_fee")
    private Long shippingFee;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

}
