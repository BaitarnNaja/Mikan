package com.mikan.restapi.model.merchant.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.aspectj.bridge.IMessage;

import java.util.UUID;

@Builder
@Getter
@Setter
public class RegistMerchantResponse {
    private UUID shopId;

}
