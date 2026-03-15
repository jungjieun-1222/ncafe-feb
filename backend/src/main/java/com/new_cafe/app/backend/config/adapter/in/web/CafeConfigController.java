package com.new_cafe.app.backend.config.adapter.in.web;

import com.new_cafe.app.backend.config.application.port.in.GetCafeConfigUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/configs")
@RequiredArgsConstructor
public class CafeConfigController {

    private final GetCafeConfigUseCase getCafeConfigUseCase;

    @GetMapping
    public Map<String, String> getAllConfigs() {
        return getCafeConfigUseCase.getAllConfigs();
    }
}
