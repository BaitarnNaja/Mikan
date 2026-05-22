package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<Users, UUID> {
    // 1. เมธอดเดิมสำหรับใช้ตอน Login
    Optional<Users> findByEmail(String email);

    // 2. เพิ่มเมธอดนี้สำหรับใช้ตอน Register (คืนค่าเป็น true/false)
    // Spring Data JPA จะสร้างคำสั่ง SELECT EXISTS(...) ให้เองอัตโนมัติ
    boolean existsByEmail(String email);
}
