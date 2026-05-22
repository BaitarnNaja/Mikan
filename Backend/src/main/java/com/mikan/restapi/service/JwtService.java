package com.mikan.restapi.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    // ต้องยาว 32 ตัวอักษรขึ้นไป
    private static final String SECRET_KEY = "a-string-secret-at-least-256-bits-long";

//    // 1. ดึง userId จากมาตรฐาน 'sub' (Subject)
//    public String extractUserId(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }


//    // 2. Generic Method สำหรับดึงข้อมูลใดๆ
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }

//    // 3. แกะ Payload ทั้งหมดออกมา (jjwt 0.12.x Syntax)
//    public Claims extractAllClaims(String token) {
//        return Jwts.parser()
//                .verifyWith(getSignInKey())
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }

    // 4. ตรวจสอบความถูกต้องและวันหมดอายุ
//    public boolean isTokenValid(String token) {
//        try {
//            return !isTokenExpired(token);
//        } catch (Exception e) {
//            return false;
//        }
//    }

//    public String generateToken(UUID userId, Map<String, Object> extraClaims) {
//        return Jwts.builder()
//                .claims(extraClaims)           // 1. ใส่ข้อมูลเสริม (เช่น email, role)
//                .subject(userId.toString())               // 2. ใส่ userId ลงในช่อง 'sub'
//                .issuedAt(new Date(System.currentTimeMillis())) // 3. วันที่สร้าง
//                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 4. วันหมดอายุ (เช่น 24 ชม.)
//                .signWith(getSignInKey())      // 5. เซ็นชื่อด้วย Secret Key ของเรา
//                .compact();                    // 6. บีบอัดเป็นสายอักขระ JWT
//    }

//    private boolean isTokenExpired(String token) {
//        return extractClaim(token, Claims::getExpiration).before(new Date());
//    }

//    private SecretKey getSignInKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
//    }

    // ดึง Secret Key จาก application.properties หรือ Environment Variables ห้าม Hardcode เด็ดขาด!
    @Value("${jwt.secret}")
    private String secretKey;

    // ชื่อผู้ออก Token (เช่น https://api.yourdomain.com)
    @Value("${jwt.issuer}")
    private String issuer;

    /**
     * สร้าง Access Token (ใช้งานหลัก)
     * อายุสั้น (เช่น 15 นาที) เพื่อลดความเสี่ยงหาก Token ถูกขโมย
     */
    public String generateJwt(String userId, String email, String role) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        return JWT.create()
                .withIssuer(issuer)                            // iss: ระบุว่าใครเป็นคนออก Token นี้
                .withSubject(userId)                           // sub: ระบุว่า Token นี้เป็นของใคร (มักใช้ User ID)
                .withClaim("email", email)                     // Custom Claim: ข้อมูลที่ Frontend อาจต้องใช้
                .withClaim("role", role)                       // Custom Claim: สิทธิ์การใช้งาน
                .withIssuedAt(Date.from(Instant.now()))        // iat: เวลาที่สร้าง Token
                .withExpiresAt(Date.from(Instant.now().plus(9999999, ChronoUnit.MINUTES))) // exp: หมดอายุใน 15 นาที
                .withJWTId(UUID.randomUUID().toString())       // jti: ไอดีเฉพาะของ Token วงนี้
                .sign(algorithm);
    }

    /**
     * สร้าง Refresh Token (ใช้สำหรับขอ Access Token ใหม่)
     * อายุยาว (เช่น 7-30 วัน) และเก็บข้อมูลให้น้อยที่สุด
     */
    public String generateRefresh(String userId) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        return JWT.create()
                .withIssuer(issuer)
                .withSubject(userId)
                // ข้อควรระวัง: Refresh Token ไม่ควรมี Claims พวก Email หรือ Role เพราะข้อมูลพวกนี้อาจเปลี่ยนแปลงได้
                .withIssuedAt(Date.from(Instant.now()))
                .withExpiresAt(Date.from(Instant.now().plus(9999999, ChronoUnit.DAYS))) // exp: หมดอายุใน 7 วัน
                .withJWTId(UUID.randomUUID().toString())       // jti: **สำคัญมาก** ใช้สำหรับบันทึกลง Database เพื่อทำ Revocation
                .sign(algorithm);
    }

    /**
     * ตรวจสอบความถูกต้องของ Token (ใช้ตรวจสอบทุกครั้งที่มีการเรียก API)
     *
     * @param token รูปแบบ JWT String ที่รับมาจาก Header (ตัดคำว่า "Bearer " ออกแล้ว)
     * @return DecodedJWT ออบเจกต์ที่ถอดรหัสแล้ว (เอาไปดึงค่า userId, email ต่อได้)
     */
    public DecodedJWT verifyToken(String token) {
        try {
            // 1. ต้องใช้ Algorithm และ Secret Key ตัวเดียวกับตอนสร้าง
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            // 2. สร้าง Verifier และบังคับว่า Issuer ต้องตรงกับที่เราตั้งไว้
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build();

            // 3. ทำการตรวจสอบ (Verify)
            // ถ้า Token หมดอายุ, ถูกดัดแปลง, หรือ Issuer ไม่ตรง มันจะโยน Exception ทันที
            return verifier.verify(token);

        } catch (TokenExpiredException e) {
            // กรณีแยกจับ Exception เพื่อให้รู้ว่า "หมดอายุ" (Frontend จะได้เอา Refresh Token มาแลก)
            System.out.println("Token หมดอายุแล้ว: " + e.getMessage());
            throw new RuntimeException("TOKEN_EXPIRED"); // แนะนำให้ใช้ Custom Exception ของคุณเอง

        } catch (JWTVerificationException e) {
            // กรณีอื่นๆ เช่น ลายเซ็นไม่ตรง, Token ถูกปลอมแปลง
            System.out.println("Token ไม่ถูกต้อง หรือถูกดัดแปลง: " + e.getMessage());
            throw new RuntimeException("INVALID_TOKEN");
        }
    }
}
