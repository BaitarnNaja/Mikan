package com.mikan.restapi.model.address.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;
@Setter
@Getter
@Builder
public class GetAllAddressResponse {
    private List<AddressResponse> data;
    @Setter
    @Getter
    public static class AddressResponse {
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

