package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.adapter.out.persistence.entity.UserEntity;
import com.new_cafe.app.backend.auth.adapter.out.persistence.repository.UserRepository;
import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AccountPersistenceAdapter implements LoadAccountPort, SaveAccountPort {

    private final UserRepository userRepository;

    @Override
    public Optional<Account> loadAccount(String username) {
        return userRepository.findByNickname(username)
                .map(user -> Account.of(
                        user.getNickname(),
                        user.getPassword(),
                        user.getNickname()
                ));
    }

    @Override
    public void saveAccount(Account account) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(UUID.randomUUID().toString());
        userEntity.setNickname(account.getUsername());
        userEntity.setPassword(account.getPassword());
        userEntity.setRole("ROLE_USER"); // Default role
        userRepository.save(userEntity);
    }
}
