package com.kairos.controller;

import com.kairos.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/health"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> info = new HashMap<>();
        info.put("status", "UP");
        info.put("app", "Kairos Event Planner API");
        info.put("version", "1.0.0");
        info.put("stack", "Java 17 / Spring Boot 3 / MySQL / JPA");
        return ResponseEntity.ok(ApiResponse.success("Kairos API is running 🚀", info));
    }
}
