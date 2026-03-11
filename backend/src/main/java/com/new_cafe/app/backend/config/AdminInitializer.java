package com.new_cafe.app.backend.config;

import com.new_cafe.app.backend.auth.adapter.out.persistence.entity.UserEntity;
import com.new_cafe.app.backend.auth.adapter.out.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByNickname("admin").isEmpty()) {
            UserEntity admin = new UserEntity();
            admin.setId(UUID.randomUUID().toString());
            admin.setNickname("admin");
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            log.info("✅ Admin account created (admin / 1234)");
        } else {
            log.info("ℹ️ Admin account already exists, skipping creation");
        }
    }
}
