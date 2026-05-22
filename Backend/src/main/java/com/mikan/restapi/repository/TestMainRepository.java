package com.mikan.restapi.repository;

import com.mikan.restapi.entity.TestMain;
import org.aspectj.weaver.ast.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TestMainRepository  extends JpaRepository<TestMain, UUID> {

    //Simple JPA
    List<TestMain> findByName(String name);
    Page<TestMain> findByNameContainingIgnoreCase(String name, Pageable pageable);

    //JPQL
    @Query("""
        SELECT t FROM TestMain t
        JOIN t.testSub s
        WHERE s.name = :subName
    """)
    List<TestMain> findBySubName(@Param("subName") String subName);

    //JPQL + Pagination
    @Query("""
        SELECT t FROM TestMain t
        JOIN t.testSub s
        WHERE (:name IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:subName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :subName, '%')))
    """)
    Page<TestMain> search(
            @Param("name") String name,
            @Param("subName") String subName,
            Pageable pageable
    );
}
