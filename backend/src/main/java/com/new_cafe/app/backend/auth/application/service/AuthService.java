package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.command.LoginCommand;
import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.WithdrawUseCase;
import com.new_cafe.app.backend.auth.application.port.out.DeleteAccountPort;
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
public class AuthService implements LoginUseCase, SignupUseCase, WithdrawUseCase {

    private final LoadAccountPort loadAccountPort;
    private final SaveAccountPort saveAccountPort;
    private final DeleteAccountPort deleteAccountPort;
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
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        Account account = Account.of(
                null,
                request.getUsername(),
                request.getName(),
                request.getNickname(),
                request.getEmail(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_USER"
        );

        saveAccountPort.saveAccount(account);
    }

    @Override
    public void withdraw(String username, String password) {
        Account account = loadAccountPort.loadAccount(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(password, account.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        deleteAccountPort.deleteAccount(account.getId());
    }
}
