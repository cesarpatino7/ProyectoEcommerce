package com.taller.ingenieria.api.security;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.function.Function;

public interface JwtService {

    String extractUsername(String token);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);

    public Claims extractAllClaims(String token);

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

}
