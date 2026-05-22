package com.mikan.restapi.repository;

import com.mikan.restapi.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUsers_Id(UUID uid);
    List<Address> findByUsers_IdAndIsDefaultTrue(UUID uid);
}
