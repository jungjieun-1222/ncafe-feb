package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.Account;

public interface SaveAccountPort {
    void saveAccount(Account account);
}
