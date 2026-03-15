package com.new_cafe.app.backend.admin.settings.adapter.in.web;

import com.new_cafe.app.backend.admin.settings.adapter.in.web.dto.AccountWebModel;
import com.new_cafe.app.backend.admin.settings.adapter.in.web.dto.CreateAccountRequest;
import com.new_cafe.app.backend.admin.settings.adapter.in.web.dto.PasswordChangeRequest;
import com.new_cafe.app.backend.admin.settings.application.port.in.ManageAccountUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final ManageAccountUseCase manageAccountUseCase;

    @GetMapping
    public List<AccountWebModel> getAllAccounts() {
        return manageAccountUseCase.getAllAccounts().stream()
                .map(account -> AccountWebModel.builder()
                        .id(account.getId())
                        .username(account.getUsername())
                        .name(account.getName())
                        .role(account.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @PostMapping
    public void createStaffAccount(@RequestBody CreateAccountRequest request) {
        manageAccountUseCase.createStaffAccount(request.getUsername(), request.getPassword(), request.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable String id) {
        manageAccountUseCase.deleteAccount(id);
    }

    @PutMapping("/password")
    public void changePassword(@RequestBody PasswordChangeRequest request, Principal principal) {
        manageAccountUseCase.changePassword(principal.getName(), request.getNewPassword());
    }
}
