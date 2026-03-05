package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;

public interface SignupUseCase {
    void signup(SignupRequest request);
}
