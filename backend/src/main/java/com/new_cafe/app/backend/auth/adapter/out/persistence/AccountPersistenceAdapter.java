package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AccountPersistenceAdapter implements LoadAccountPort {

    @Override
    public Optional<Account> loadAccount(String username) {
        // 실제 구현 시 JPA Repository 등을 호출
        // 현재는 구조 파악을 위해 Mock 데이터를 반환하거나 빈 값을 반환
        if ("admin".equals(username)) {
            return Optional.of(Account.of("admin", "1234", "관리자"));
        }
        return Optional.empty();
    }
}
