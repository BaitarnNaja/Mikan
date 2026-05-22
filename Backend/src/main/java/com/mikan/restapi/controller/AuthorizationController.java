package com.mikan.restapi.controller;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.mikan.restapi.model.authorization.request.LoginRequest;
import com.mikan.restapi.model.authorization.request.RegisterRequest;
import com.mikan.restapi.model.authorization.response.LoginResponse;
import com.mikan.restapi.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/v1/auth")
public class AuthorizationController {
//    // ตั้งค่า Azure AD
//    private final String TENANT_ID = "your-tenant-id";
//    private final String CLIENT_ID = "your-client-id";
//    private final String BACKEND_SECRET = "your-very-secure-secret-key";
//
//    @PostMapping("/generate-jwt")
//    public ResponseEntity<?> generateJwt(@RequestBody Map<String, String> body, HttpServletResponse response) {
//        try {
//            String idToken = body.get("idToken");
//
//            // 1. ดึง Public Key จาก Azure (JWKS)
//            JwkProvider provider = new UrlJwkProvider(new URL("https://login.microsoftonline.com/" + TENANT_ID + "/discovery/v2.0/keys"));
//            DecodedJWT decodedIdToken = JWT.decode(idToken);
//            Jwk jwk = provider.get(decodedIdToken.getKeyId()); // หา Key ที่ตรงกับ kid ใน Token
//
//            // 2. ตรวจสอบ Token (Verify)
//            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
//            JWTVerifier verifier = JWT.require(algorithm)
//                    .withIssuer("https://login.microsoftonline.com/" + TENANT_ID + "/v2.0")
//                    .withAudience(CLIENT_ID)
//                    .build();
//
//            DecodedJWT verifiedToken = verifier.verify(idToken); // <--- ใช้ .verify() ตรงนี้
//
//            // 3. สกัดข้อมูลจาก idToken เพื่อสร้าง JWT ใหม่ของเรา
//            String backendJwt = JWT.create()
//                    .withClaim("userId", verifiedToken.getSubject())
//                    .withClaim("username", verifiedToken.getClaim("name").asString())
//                    .withClaim("email", verifiedToken.getClaim("preferred_username").asString())
//                    .withClaim("role", "DEV")
//                    .withExpiresAt(new Date(System.currentTimeMillis() + 3600000)) // 1 ชม.
//                    .sign(Algorithm.HMAC256(BACKEND_SECRET));
//
//            // 4. สร้าง HttpOnly Cookie
//            ResponseCookie cookie = ResponseCookie.from("backend_jwt", backendJwt)
//                    .httpOnly(true)
//                    .secure(true) // true สำหรับ HTTPS
//                    .path("/")
//                    .maxAge(3600)
//                    .sameSite("Lax")
//                    .build();
//
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
//                    .body(Map.of("message", "Success"));
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token: " + e.getMessage());
//        }
//    }

    private final AuthService authService;

    public AuthorizationController(AuthService authService) { this.authService = authService;}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        // โยน Request ไปให้ Service จัดการ Business Logic ทั้งหมด
        LoginResponse response = authService.authenticateUser(request);

        // คืนค่า 200 OK พร้อมกับ JSON Response (Token + User Data)
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        // เรียกใช้ Service สำหรับสมัครสมาชิก
        // ในที่นี้เราตั้งให้สมัครเสร็จแล้วคืนค่า LoginResponse (Token) กลับไปเลย
        return ResponseEntity.ok(authService.registerUser(request));
    }


}
