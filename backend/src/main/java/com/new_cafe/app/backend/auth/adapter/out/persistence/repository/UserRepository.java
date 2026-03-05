package com.new_cafe.app.backend.auth.adapter.out.persistence.repository;

import com.new_cafe.app.backend.auth.adapter.out.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByNickname(String nickname);
}
