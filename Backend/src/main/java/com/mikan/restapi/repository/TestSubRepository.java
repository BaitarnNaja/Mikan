package com.mikan.restapi.repository;

import com.mikan.restapi.entity.TestMain;
import com.mikan.restapi.entity.TestSub;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface TestSubRepository extends JpaRepository<TestSub, UUID> {
    // JPA มีให้
    /// save()
    /// findAll()
    /// findById()
    /// deleteById()

    // 🔥 search + pagination
    Page<TestSub> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
 