package com.mikan.restapi.model.authorization.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    // คุณสามารถเพิ่มฟิลด์อื่นๆ เช่น phone, address ได้ที่นี่
}
