package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.Account;
import java.util.Optional;

public interface LoadAccountPort {
    Optional<Account> loadAccount(String username);
}
