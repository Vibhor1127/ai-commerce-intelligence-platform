package com.vibhor.ecommerceanalytics.Service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret:my-super-secret-key-for-ecommerce-analytics-project-2026}")
    private String secretKey;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationTime; // 1 hour default

    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Create JWT after successful login
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + expirationTime)
                )
                .signWith(getSigningKey())
                .compact();
    }

    // Get username from JWT
    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(
                        (javax.crypto.SecretKey) getSigningKey()
                )
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Extract expiration date from JWT
    private Date extractExpiration(String token) {

        return Jwts.parser()
                .verifyWith(
                        (javax.crypto.SecretKey) getSigningKey()
                )
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    // Check whether token has expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Check whether token is valid (username matches AND not expired)
    public boolean isTokenValid(
            String token,
            UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }
}