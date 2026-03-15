package com.new_cafe.app.backend.admin.settings.application.port.in;

import com.new_cafe.app.backend.auth.domain.Account;
import java.util.List;

public interface ManageAccountUseCase {
    List<Account> getAllAccounts();
    void createStaffAccount(String username, String password, String name);
    void deleteAccount(String id);
    void changePassword(String username, String newPassword);
}
