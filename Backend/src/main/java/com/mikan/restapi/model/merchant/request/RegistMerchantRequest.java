package com.mikan.restapi.model.merchant.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class RegistMerchantRequest {
    @NotBlank
    private String shopName;

    private String logoImg;
    private String shopDsc;

    @Email
    private String contractMail;
    @Pattern(regexp = "^\\+?[0-9]{9,15}$")
    private String contractPhone;

    private String contractLink;

}
