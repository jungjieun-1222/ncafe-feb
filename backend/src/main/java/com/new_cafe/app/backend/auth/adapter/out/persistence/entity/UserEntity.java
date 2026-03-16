package com.new_cafe.app.backend.auth.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    private String id; // DB가 UUID를 사용하므로 String으로 매핑

    @Column(unique = true)
    private String username;

    @Column
    private String name;

    @Column(unique = true)
    private String nickname;

    @Column(unique = true)
    private String email;

    @Column
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;
}
