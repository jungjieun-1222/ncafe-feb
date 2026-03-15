package com.new_cafe.app.backend.config.application.port.in;

import java.util.Map;

public interface GetCafeConfigUseCase {
    Map<String, String> getAllConfigs();
    String getConfig(String key);
}
