package com.mikan.restapi.model.contract.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContractRequest {
    private String contractId;
    private String customerName;
    private String customerAddress;
    private String companyName;
    private String companyAddress;
    private String email;
    private String mobile;
    private String type;
    private BigDecimal amount;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private String details;
}
