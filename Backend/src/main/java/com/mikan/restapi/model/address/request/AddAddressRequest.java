package com.mikan.restapi.model.address.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddAddressRequest {

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
