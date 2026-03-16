package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.adapter.out.persistence.entity.UserEntity;
import com.new_cafe.app.backend.auth.adapter.out.persistence.repository.UserRepository;
import com.new_cafe.app.backend.auth.application.port.out.DeleteAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.LoadAccountPort;
import com.new_cafe.app.backend.auth.application.port.out.LoadAllAccountsPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveAccountPort;
import com.new_cafe.app.backend.auth.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AccountPersistenceAdapter implements LoadAccountPort, SaveAccountPort, LoadAllAccountsPort, DeleteAccountPort {

    private final UserRepository userRepository;

    @Override
    public Optional<Account> loadAccount(String username) {
        return userRepository.findByUsername(username)
                .map(this::mapToDomain);
    }

    @Override
    public List<Account> loadAllAccounts() {
        return userRepository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccount(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public void saveAccount(Account account) {
        UserEntity userEntity = userRepository.findById(account.getId() != null ? account.getId() : "")
                .orElse(new UserEntity());
        
        if (userEntity.getId() == null) {
            userEntity.setId(account.getId() != null ? account.getId() : UUID.randomUUID().toString());
        }
        userEntity.setUsername(account.getUsername());
        userEntity.setName(account.getName());
        userEntity.setNickname(account.getNickname());
        userEntity.setEmail(account.getEmail());
        userEntity.setPhone(account.getPhone());
        userEntity.setPassword(account.getPassword());
        userEntity.setRole(account.getRole() != null ? account.getRole() : "ROLE_USER");
        userRepository.save(userEntity);
    }

    private Account mapToDomain(UserEntity user) {
        return Account.of(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getPhone(),
                user.getPassword(),
                user.getRole()
        );
    }
}
