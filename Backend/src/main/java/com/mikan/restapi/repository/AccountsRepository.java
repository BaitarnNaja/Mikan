package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountsRepository extends JpaRepository<Accounts, UUID> {

    // ใช้ JPQL เพื่อหา Account โดยเช็คจาก Email ในตาราง Users และ Provider ต้องเป็น 'credentials'
    @Query("SELECT a FROM Accounts a JOIN a.user u WHERE u.email = :email AND a.provider = 'credentials'")
    Optional<Accounts> findLocalAccountByEmail(@Param("email") String email);
}