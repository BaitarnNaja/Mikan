package com.mikan.restapi.service;

import com.mikan.restapi.entity.Address;
import com.mikan.restapi.entity.Users;
import com.mikan.restapi.model.GlobalException;
import com.mikan.restapi.model.address.request.AddAddressRequest;
import com.mikan.restapi.model.address.request.DeleteAddressRequest;
import com.mikan.restapi.model.address.request.EditAddressRequest;
import com.mikan.restapi.model.address.response.*;
import com.mikan.restapi.repository.AddressRepository;
import com.mikan.restapi.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UsersRepository usersRepository;

    public AddressService(AddressRepository addressRepository,UsersRepository usersRepository) {
        this.addressRepository = addressRepository;
        this.usersRepository = usersRepository;
    }

    public AddAddressResponse addAddress(String userId,AddAddressRequest request) {
        UUID uid = UUID.fromString(userId);


        Optional<Users> user = usersRepository.findById(uid);
        Address address = new Address();
        address.setFirstname(request.getFirstname());
        address.setLastname(request.getLastname());
        address.setLine(request.getAddress());
        address.setRoad(request.getRoad());
        address.setDistrict(request.getDistrict());
        address.setSubdistrict(request.getSubdistrict());
        address.setProvince(request.getProvince());
        address.setPostcode(request.getPostcode());
        address.setPhone(request.getPhone());
        address.setIsDefault(request.getIsDefault());
        address.setUsers(user.get());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> defaultList = addressRepository
                    .findByUsers_IdAndIsDefaultTrue(address.getUsers().getId());

            defaultList.forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(defaultList);
        }

        Address saved = addressRepository.save(address);

        return AddAddressResponse.builder()
                .addressId(saved.getId())
                .build();
    }

    public GetAllAddressResponse getAllAddress(String userId) {
        UUID uid = UUID.fromString(userId);

        var addressList = addressRepository.findByUsers_Id(uid);

        var responseList = addressList.stream().map(addr -> {
            GetAllAddressResponse.AddressResponse res = new GetAllAddressResponse.AddressResponse();

            res.setId(addr.getId().toString());
            res.setFirstname(addr.getFirstname());
            res.setLastname(addr.getLastname());
            res.setAddress(addr.getLine());
            res.setRoad(addr.getRoad());
            res.setDistrict(addr.getDistrict());
            res.setSubdistrict(addr.getSubdistrict());
            res.setProvince(addr.getProvince());
            res.setPostcode(addr.getPostcode());
            res.setPhone(addr.getPhone());
            res.setIsDefault(addr.getIsDefault());

            return res;
        }).toList();

        return GetAllAddressResponse.builder()
                .data(responseList)
                .build();
    }

    public GetUserAddressResponse getUserAddress(UUID addressId) {

        Address addr = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        GetUserAddressResponse.UserAddressResponse res = new GetUserAddressResponse.UserAddressResponse();
        res.setId(addr.getId().toString());
        res.setFirstname(addr.getFirstname());
        res.setLastname(addr.getLastname());
        res.setAddress(addr.getLine());
        res.setRoad(addr.getRoad());
        res.setDistrict(addr.getDistrict());
        res.setSubdistrict(addr.getSubdistrict());
        res.setProvince(addr.getProvince());
        res.setPostcode(addr.getPostcode());
        res.setPhone(addr.getPhone());
        res.setIsDefault(addr.getIsDefault());

        return GetUserAddressResponse.builder()
                .data(res)
                .build();
    }


    public EditAddressResponse editAddress(EditAddressRequest request) {
        UUID addressId = request.getId();

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (Boolean.FALSE.equals(request.getIsDefault())) {
            List<Address> defaultList = addressRepository
                    .findByUsers_IdAndIsDefaultTrue(address.getUsers().getId());

            boolean isOnlyDefault = defaultList.size() == 1
                    && defaultList.get(0).getId().equals(addressId);

            if (isOnlyDefault) {
                throw new RuntimeException("At least one address must be set as default");
            }
        }

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> defaultList = addressRepository
                    .findByUsers_IdAndIsDefaultTrue(address.getUsers().getId());

            defaultList.forEach(addr -> addr.setIsDefault(false));
            addressRepository.saveAll(defaultList);
        }

        address.setFirstname(request.getFirstname());
        address.setLastname(request.getLastname());
        address.setLine(request.getAddress());
        address.setRoad(request.getRoad());
        address.setDistrict(request.getDistrict());
        address.setSubdistrict(request.getSubdistrict());
        address.setProvince(request.getProvince());
        address.setPostcode(request.getPostcode());
        address.setPhone(request.getPhone());
        address.setIsDefault(request.getIsDefault());

        Address saved = addressRepository.save(address);

        return EditAddressResponse.builder()
                .message("success")
                .addressId(saved.getId().toString())
                .build();
    }


    public DeleteAddressResponse deleteAddress(DeleteAddressRequest request) {
        // 1. Find address by ID
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new GlobalException(
                        "NOT FOUND","Address not found",HttpStatus.NOT_FOUND));

        // 2. Check if address is default → block deletion
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            throw new GlobalException(
                    "BAD_REQUEST","Cannot delete default address",HttpStatus.BAD_REQUEST);
        }

        // 3. Delete and return response
        addressRepository.delete(address);

        return DeleteAddressResponse.builder()
                .message("Address deleted successfully")
                .addressId(request.getAddressId().toString())
                .build();
    }
}

