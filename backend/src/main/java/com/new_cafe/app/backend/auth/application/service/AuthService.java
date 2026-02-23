package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements LoginUseCase {

    private final LoadAccountPort loadAccountPort;

    @Override
    public boolean login(LoginCommand command) {
        Optional<Account> account = loadAccountPort.loadAccount(command.getUsername());
        
        if (account.isEmpty()) {
            return false;
        }

        // 유저가 직접 구현할 인증 로직 (예: BCrypt 패스워드 체크 등)
        // 현재는 단순 비교 및 구조 제공
        return account.get().getPassword().equals(command.getPassword());
    }
}
