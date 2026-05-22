package com.mikan.restapi.model.contract.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContractStatusRequest {
    private String contractId;
    private String action;
    private String status;
}
