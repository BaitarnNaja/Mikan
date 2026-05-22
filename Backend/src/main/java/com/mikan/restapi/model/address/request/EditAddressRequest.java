package com.mikan.restapi.model.address.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class EditAddressRequest {
    private UUID id;
    private String firstname;
    private String lastname;
    private String address;
    private String road;
    private String district;
    private String subdistrict;
    private String province;
    private String postcode;
    private String phone;
    private Boolean isDefault;
}
