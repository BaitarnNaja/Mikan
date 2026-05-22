package com.mikan.restapi.model.address.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class DeleteAddressRequest {
    private UUID addressId;
}
