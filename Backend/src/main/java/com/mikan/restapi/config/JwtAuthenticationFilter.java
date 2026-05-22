package com.mikan.restapi.config;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.mikan.restapi.service.AuthService;
import com.mikan.restapi.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. ตรวจสอบว่ามี Header Authorization และขึ้นต้นด้วย "Bearer " หรือไม่
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            // 2. ตรวจสอบและถอดรหัส Token ในขั้นตอนเดียว (ถ้าผิดพลาดจะโยน Exception)
            DecodedJWT decodedJWT = jwtService.verifyToken(jwt);

            // 3. ดึง userId จาก Subject
            String userId = decodedJWT.getSubject();

            // 4. ถ้ามี userId และยังไม่ได้ Authentication ใน Context ปัจจุบัน
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // (Optional) 5. ดึง Role ออกมาสร้าง Authority เพื่อให้ใช้ @PreAuthorize("hasRole('...')") ได้
                String role = decodedJWT.getClaim("role").asString();
                List<SimpleGrantedAuthority> authorities = (role != null)
                        ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                        : Collections.emptyList();

                // 6. สร้าง Authentication Token
                // ทริค: เราส่ง decodedJWT เข้าไปเป็น Principal เลย!
                // เพื่อให้ Controller ดึงข้อมูล Claims อื่นๆ ไปใช้ต่อได้ง่ายๆ
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        decodedJWT,  // Principal (ข้อมูลหลักของผู้ใช้)
                        null,        // Credentials (รหัสผ่าน ปกติไม่ใช้แล้วเพราะยืนยันด้วย JWT ไปแล้ว)
                        authorities  // Authorities (สิทธิ์การเข้าถึง)
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. เก็บข้อมูลยืนยันตัวตนลงใน Context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (JWTVerificationException e) {
            // กรณี Token หมดอายุ (TokenExpiredException) หรือ ปลอมแปลง (SignatureVerificationException)
            // ให้ Log เอาไว้ (สำคัญมากสำหรับการ Debug)
            logger.warn("JWT Verification failed: " + e.getMessage());

            // ไม่ต้องทำอะไรต่อ ปล่อยให้ FilterChain ทำงาน ระบบจะตอบกลับ 401/403 เอง
        } catch (Exception e) {
            logger.error("Authentication error: ", e);
        }

        // 8. ส่งต่อไปยัง Filter หรือ Controller ถัดไป
        filterChain.doFilter(request, response);
    }
}