package com.taller.ingenieria.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/v1/health")
public class HealthCheckController {

    @GetMapping
    public Map<String, String> check() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
}