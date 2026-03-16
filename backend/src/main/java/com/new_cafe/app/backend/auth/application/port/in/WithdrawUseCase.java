package com.new_cafe.app.backend.auth.application.port.in;

public interface WithdrawUseCase {
    void withdraw(String username, String password);
}
