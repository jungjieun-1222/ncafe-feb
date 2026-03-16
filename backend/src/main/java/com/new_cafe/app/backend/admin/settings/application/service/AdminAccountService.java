package com.new_cafe.app.backend.admin.settings.application.service;

import com.new_cafe.app.backend.admin.settings.application.port.in.ManageAccountUseCase;
import com.new_cafe.app.backend.auth.application.port.out.DeleteAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.LoadAllAccountsPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAccountService implements ManageAccountUseCase {

    private final LoadAllAccountsPort loadAllAccountsPort;
    private final LoadAccountPort loadAccountPort;
    private final SaveAccountPort saveAccountPort;
    private final DeleteAccountPort deleteAccountPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Account> getAllAccounts() {
        return loadAllAccountsPort.loadAllAccounts();
    }

    @Override
    public void createStaffAccount(String username, String password, String name) {
        if (loadAccountPort.loadAccount(username).isPresent()) {
            throw new RuntimeException("Account already exists");
        }
        Account staff = Account.of(
                null,
                username,
                name,
                name,
                email,
                "",
                passwordEncoder.encode(password),
                "ROLE_STAFF",
        );
        saveAccountPort.saveAccount(staff);
    }

    @Override
    public void deleteAccount(String id) {
        deleteAccountPort.deleteAccount(id);
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminAccountService.class);

    @Override
    public void changePassword(String username, String newPassword) {
        log.info("Changing password for user: {}", username);
        Account account = loadAccountPort.loadAccount(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        String trimmedPassword = newPassword != null ? newPassword.trim() : "";
        
        Account updated = Account.of(
                account.getId(),
                account.getUsername(),
                account.getName(),
                account.getNickname(),
                account.getEmail(),
                account.getPhone(),
                passwordEncoder.encode(trimmedPassword),
                account.getRole(),
        );
        saveAccountPort.saveAccount(updated);
        log.info("Successfully updated password for user: {}", username);
    }
}
