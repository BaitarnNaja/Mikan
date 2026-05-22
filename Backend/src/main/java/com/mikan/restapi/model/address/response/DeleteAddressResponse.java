package com.mikan.restapi.model.address.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DeleteAddressResponse{
    private String message;
    private String addressId;
}