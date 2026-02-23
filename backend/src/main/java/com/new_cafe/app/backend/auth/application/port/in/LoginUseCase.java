package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;

public interface LoginUseCase {
    boolean login(LoginCommand command);
}
