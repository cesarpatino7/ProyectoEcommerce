package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, Long> {
    Optional<InvalidatedToken> findByJti(String jti);
}