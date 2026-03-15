package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService implements LoginUseCase, SignupUseCase {

    private final LoadAccountPort loadAccountPort;
    private final SaveAccountPort saveAccountPort;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public boolean login(LoginCommand command) {
        java.util.Optional<Account> account = loadAccountPort.loadAccount(command.getUsername());
        
        if (account.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(command.getPassword(), account.get().getPassword());
    }

    @Override
    public void signup(SignupRequest request) {
        // Check if user already exists
        if (loadAccountPort.loadAccount(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Account account = Account.of(
                null,
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getUsername(),
                "ROLE_USER"
        );

        saveAccountPort.saveAccount(account);
    }
}
