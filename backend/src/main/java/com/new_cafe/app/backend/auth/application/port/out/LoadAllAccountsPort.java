package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.Account;
import java.util.List;

public interface LoadAllAccountsPort {
    List<Account> loadAllAccounts();
}
