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
            admin.setRole("ROLE_MASTER");
            userRepository.save(admin);
            log.info("✅ Admin account created (admin / 1234)");
        } else {
            UserEntity existingAdmin = userRepository.findByNickname("admin").get();
            // 임시 비밀번호 재설정 (로그인 불가 상황 해결용)
            existingAdmin.setPassword(passwordEncoder.encode("1234"));
            if ("ROLE_ADMIN".equals(existingAdmin.getRole())) {
                existingAdmin.setRole("ROLE_MASTER");
                log.info("✅ Admin role updated to ROLE_MASTER");
            }
            userRepository.save(existingAdmin);
            log.info("⚠️ Admin password has been reset to 1234 for emergency access");
        }
    }
}
