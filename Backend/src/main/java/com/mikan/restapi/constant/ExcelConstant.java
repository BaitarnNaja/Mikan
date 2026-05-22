package com.mikan.restapi.constant;

public class ExcelConstant {
    public static final Object[] EXCEL_CONTRACT_INQUIRY_HEADER_FIELDS = {
            "Customer Name", "Customer address",
            "Company Name", "Company Address",
            "email", "mobile", "type",
            "Amount",
            "Start Date", "End Date",
            "Detail", "Status",
            "Created At", "Updated At",
            "PDF URL"
    };

    public static final String[] EXCEL_CONTRACT_INQUIRY_HEADER_TYPE = {
            "String", "String",
            "String", "String",
            "String", "String", "String",
            "BigDecimal;#,##0.00",
            "String", "String",
            "String", "String",
            "String", "String",
            "String"
    };
}
