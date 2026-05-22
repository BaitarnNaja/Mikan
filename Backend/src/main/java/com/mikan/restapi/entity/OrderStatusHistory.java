package com.mikan.restapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "order_status_history", schema = "mikan_main")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "status")
    private String status;

    @Column(name = "reason_code")
    private String reasonCode;

    @Column(name = "reason_detail")
    private String reasonDetail;

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderDetails orderDetails;
}
