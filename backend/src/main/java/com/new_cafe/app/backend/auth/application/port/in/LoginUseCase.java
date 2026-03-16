package com.new_cafe.app.backend.auth.application.port.in;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.domain.Account;
import java.util.Optional;

public interface LoginUseCase {
    Optional<Account> login(LoginCommand command);
}
