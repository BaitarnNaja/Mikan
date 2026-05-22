package com.mikan.restapi.service;

import com.mikan.restapi.constant.ExcelConstant;
import com.mikan.restapi.entity.rowmappers.ContractMapper;
import com.mikan.restapi.model.contract.request.*;
import com.mikan.restapi.model.contract.response.*;
import com.mikan.restapi.repository.ContractRepository;
import com.mikan.restapi.utils.ExcelUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractMapper contractMapper;

    @Autowired
    private ExcelUtils excelUtils;

    public CreateContractResponse createContract(CreateContractRequest request){
        int id = contractRepository.insertContract(request);
        contractRepository.insertContractState(id);
        return CreateContractResponse.builder()
                .code("200")
                .msg("success")
                .build();
    }

    public List<InquiryContractResponse> inquiryContract(InquiryContractRequest request){
        return  contractRepository.inquiryContract(request);
    }

    public byte[] exportInquiryContract (InquiryContractRequest request){
        List<InquiryContractResponse> contractResponsesList = contractRepository.inquiryContract(request);

        try {
            Map<String, Object[]> data = contractMapper.convertListToMap(contractResponsesList);
            Map<String, String> dataFormats = new TreeMap<>();
            int rowNo = 1;
            for(String value : ExcelConstant.EXCEL_CONTRACT_INQUIRY_HEADER_TYPE){
                dataFormats.put(String.valueOf(rowNo), value);
                rowNo++;
            }

            Map<String, Map> dataSheet = new TreeMap<>();
            dataSheet.put("Contract", data);



            return excelUtils.generateExcelFile("xlsx",dataSheet,dataFormats);
        } catch (Exception e){
            throw new RuntimeException("[ContractService] generate file error.",e);
        }
    }

    public UpdateContractResponse updateContract(UpdateContractRequest request){
        contractRepository.updateContract(request);

        return  UpdateContractResponse.builder()
                .code("200")
                .msg("success")
                .build();
    }

    public UpdateContractStatusResponse updateContractStatus(UpdateContractStatusRequest request){
        if("Review".equalsIgnoreCase(request.getAction())){
            contractRepository.updateContractStateByReview(request.getContractId() , request.getStatus());
        } else if ("Approve".equalsIgnoreCase(request.getAction())) {
            contractRepository.updateContractStateByApprove(request.getContractId() , request.getStatus());
        }
        contractRepository.updateContractStatus(request.getContractId() , request.getStatus());
        return  UpdateContractStatusResponse.builder()
                .code("200")
                .msg("success")
                .build();
    }

    @Transactional // เพิ่มเพื่อให้การลบทั้ง 2 table เป็น Atomic (สำเร็จทั้งหมด หรือไม่สำเร็จเลย)
    public DeleteContractResponse deleteContract(DeleteContractRequest request) {
        try {
            // 1. แปลงค่า และควรเช็ค null/empty ก่อนถ้าไม่ได้ทำใน Validator
            long id = Long.parseLong(request.getContractId());

            // 2. ลบข้อมูลหลัก
            int num = contractRepository.deleteContractById(id);

            if (num > 0) {
                // 3. ลบข้อมูลที่เกี่ยวข้อง
                contractRepository.deleteContractStatusById(id);

                return DeleteContractResponse.builder()
                        .code("200")
                        .msg("Success: Contract deleted")
                        .build();
            } else {
                // กรณีไม่พบ ID ที่ต้องการลบ
                return DeleteContractResponse.builder()
                        .code("404")
                        .msg("Error: Contract ID not found")
                        .build();
            }

        } catch (NumberFormatException e) {
            return DeleteContractResponse.builder()
                    .code("400")
                    .msg("Error: Invalid Contract ID format")
                    .build();
        } catch (Exception e) {
            // กรณีเกิด Database Error อื่นๆ
            return DeleteContractResponse.builder()
                    .code("500")
                    .msg("Error: Internal server error")
                    .build();
        }
    }
}
