package com.mikan.restapi.service;

import com.mikan.restapi.entity.Merchant;
import com.mikan.restapi.entity.Users;
import com.mikan.restapi.model.GlobalException;
import com.mikan.restapi.model.merchant.request.RegistMerchantRequest;
import com.mikan.restapi.model.merchant.response.RegistMerchantResponse;
import com.mikan.restapi.repository.MerchantRepository;
import com.mikan.restapi.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final UsersRepository usersRepository;

    public MerchantService(MerchantRepository merchantRepository, UsersRepository usersRepository){
        this.merchantRepository = merchantRepository;
        this.usersRepository = usersRepository;
    }

    public RegistMerchantResponse registMerchant(String userId, RegistMerchantRequest request){
        UUID uid = UUID.fromString(userId);
        Optional<Merchant> existing = merchantRepository.findByUsersId(UUID.fromString(userId));
        if (existing.isPresent()) {
            throw new GlobalException("MERCHANT_EXISTS", "Merchant already exists", HttpStatus.CONFLICT);
        }
        Users user = usersRepository.findById(uid).orElseThrow(() -> new GlobalException(
                "USER_NOT_FOUND",
                "User not found",
                HttpStatus.NOT_FOUND
        ));;

        Merchant merchant = new Merchant();
        merchant.setShopName(request.getShopName());
        merchant.setLogoImg(request.getLogoImg());
        merchant.setShopDsc(request.getShopDsc());
        merchant.setContractMail(request.getContractMail());
        merchant.setContractPhone(request.getContractPhone());
        merchant.setContractLink(request.getContractLink());
        merchant.setCreatedAt(LocalDateTime.now());
        merchant.setShippingFee((long) 50.0);
        merchant.setUsers(user);

        Merchant db = merchantRepository.save(merchant);

        user.setRole("SELLER");
        usersRepository.save(user);
        return RegistMerchantResponse.builder()
                .shopId(db.getId())
                .build();
    }



}
