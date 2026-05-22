package com.mikan.restapi.model.address.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
@Setter
@Getter
@Builder
public class AddAddressResponse {
    private UUID  addressId;
}
