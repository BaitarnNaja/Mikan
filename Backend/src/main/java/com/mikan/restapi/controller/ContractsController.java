package com.mikan.restapi.controller;

import com.mikan.restapi.model.contract.request.*;
import com.mikan.restapi.model.contract.response.*;
import com.mikan.restapi.service.ContractService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.*;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/contracts")
public class ContractsController {
    @Autowired
    private ContractService contractService;

    @PostMapping("/createcontract")
    public ResponseEntity<CreateContractResponse> createcontract (@Valid @RequestBody CreateContractRequest request){
        log.info("[API CONTRACTS] /createcontract Request : {}",request);
        CreateContractResponse response = contractService.createContract(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    @PostMapping("/inquirycontract")
    public ResponseEntity<List<InquiryContractResponse>> inquirycontract (@Valid @RequestBody InquiryContractRequest request){
        log.info("[API CONTRACTS] /inquirycontract Request : {}",request);
        List<InquiryContractResponse> response = contractService.inquiryContract(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    @PostMapping("/exportcontract")
    public ResponseEntity<byte[]> exportContract (@Valid @RequestBody InquiryContractRequest request){
        log.info("[API CONTRACTS] /exportcontract Request : {}",request);
        byte[] response = contractService.exportInquiryContract(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(
                ContentDisposition.builder("attachment")
                        .filename("Contract.xlsx")
                        .build()
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(headers)
                .body(response);
    }

    @PostMapping("/updatecontract")
    public ResponseEntity<UpdateContractResponse> updateContract (@Valid @RequestBody UpdateContractRequest request){
        log.info("[API CONTRACTS] /updatecontract Request : {}",request);
        UpdateContractResponse response = contractService.updateContract(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    @PostMapping("/updatecontract/status")
    public ResponseEntity<UpdateContractStatusResponse> updateContractStatus (@Valid @RequestBody UpdateContractStatusRequest request){
        log.info("[API CONTRACTS] /updatecontract/status Request : {}",request);
        UpdateContractStatusResponse response = contractService.updateContractStatus(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }

    @DeleteMapping("/deletecontract")
    public ResponseEntity<DeleteContractResponse> deleteContract (@Valid @RequestBody DeleteContractRequest request){
        log.info("[API CONTRACTS] /deletecontract Request : {}",request);
        DeleteContractResponse response = contractService.deleteContract(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .headers(new HttpHeaders())
                .body(response);
    }
}
