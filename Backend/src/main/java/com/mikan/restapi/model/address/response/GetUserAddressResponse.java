package com.mikan.restapi.model.address.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;
@Setter
@Getter
@Builder
public class GetUserAddressResponse {
    private UserAddressResponse data;

    @Setter
    @Getter
    public static class UserAddressResponse {
        private String id;
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
}
