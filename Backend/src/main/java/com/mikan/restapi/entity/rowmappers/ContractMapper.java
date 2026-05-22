package com.mikan.restapi.entity.rowmappers;

import com.mikan.restapi.constant.ExcelConstant;
import com.mikan.restapi.model.contract.response.InquiryContractResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@Component
public class ContractMapper {
    public Map<String , Object[]> convertListToMap(List<InquiryContractResponse> input) throws Exception{
        Map<String, Object[]> output = new TreeMap<>();
        try {
            output.put("1", ExcelConstant.EXCEL_CONTRACT_INQUIRY_HEADER_FIELDS);
            int itemNo = 2;
            if(CollectionUtils.isNotEmpty(input)){
                for (InquiryContractResponse item : input){
                    Object[] itemObj;
                    String itemNoStr = String.valueOf(itemNo);
                    itemObj = new Object[]{
                            StringUtils.defaultIfEmpty(String.valueOf(item.getCustomerName()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getCustomerAddress()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getCompanyName()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getCompanyAddress()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getEmail()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getMobile()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getType()),""),
                            item.getAmount(),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getStartDate()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getEndDate()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getDetails()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getStatus()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getCreated_at()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getUpdated_at()),""),
                            StringUtils.defaultIfEmpty(String.valueOf(item.getPdfUrl()),""),
                    };
                    output.put(itemNoStr, itemObj);
                    itemNo++;
                }

            }
        }
        catch (Exception e){
            throw new Exception("[ContractMapper] Error in convertListToMap : "+ e.getMessage());
        }
        return new TreeMap<>(output);
    }
}
