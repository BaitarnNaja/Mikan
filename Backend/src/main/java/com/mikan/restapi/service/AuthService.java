package com.mikan.restapi.service;
import com.mikan.restapi.entity.Accounts;
import com.mikan.restapi.entity.Users;
import com.mikan.restapi.model.authorization.request.LoginRequest;
import com.mikan.restapi.model.authorization.request.RegisterRequest;
import com.mikan.restapi.model.authorization.response.LoginResponse;
import com.mikan.restapi.repository.AccountsRepository;
import com.mikan.restapi.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountsRepository accountsRepository;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public LoginResponse authenticateUser(LoginRequest request) {
        // 1. ค้นหา Account ผ่าน JPQL ที่เราเขียนไว้
        Accounts account = accountsRepository.findLocalAccountByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("อีเมลหรือรหัสผ่านไม่ถูกต้อง"));

        // 2. ตรวจสอบรหัสผ่าน (Password Hash)
        if (!passwordEncoder.matches(request.getPassword(), account.getPasswordHash())) {
            throw new RuntimeException("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // 3. ดึงข้อมูล User จาก Relation ใน Account
        Users user = account.getUser();

        // 4. สร้าง JWT
        String accessToken = jwtService.generateJwt(user.getId().toString(), user.getEmail(), user.getRole());
        String refreshToken = jwtService.generateRefresh(user.getId().toString());

        // 5. ประกอบร่าง Response กลับไปให้ Next.js
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional // สำคัญมาก: เพื่อให้บันทึก 2 ตารางพร้อมกันแบบสมบูรณ์
    public LoginResponse registerUser(RegisterRequest request) {

        // 1. ตรวจสอบว่า Email นี้ถูกใช้งานไปหรือยัง
        if (usersRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email นี้ถูกใช้งานไปแล้ว");
        }

        // 2. สร้าง Entity Users
        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setRole("USER"); // กำหนด Role เริ่มต้น
        user.setCreateAt(LocalDateTime.now());
        user.setStatus("ACTIVE");

        // บันทึก User ก่อนเพื่อให้ได้ ID มาใช้งาน
        Users savedUser = usersRepository.save(user);

        // 3. สร้าง Entity Accounts สำหรับการ Login ด้วย Password (Credentials)
        Accounts account = new Accounts();
        account.setUser(savedUser); // ผูกความสัมพันธ์กับ User ที่เพิ่งสร้าง
        account.setProvider("credentials");
        account.setPasswordHash(passwordEncoder.encode(request.getPassword())); // Hash รหัสผ่าน
        account.setCreateAt(LocalDateTime.now());

        accountsRepository.save(account);

        // 4. (Optional) สมัครเสร็จแล้วให้ Login ให้เลย โดยสร้าง Token ส่งกลับไป
        String accessToken = jwtService.generateJwt(savedUser.getId().toString(), savedUser.getEmail(), savedUser.getRole());
        String refreshToken = jwtService.generateRefresh(savedUser.getId().toString());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(LoginResponse.UserInfo.builder()
                        .id(savedUser.getId())
                        .email(savedUser.getEmail())
                        .name(savedUser.getName())
                        .role(savedUser.getRole())
                        .build())
                .build();
    }
}