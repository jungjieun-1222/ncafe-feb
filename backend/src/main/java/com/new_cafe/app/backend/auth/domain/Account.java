package com.new_cafe.app.backend.auth.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Account {
    private final String username;
    private final String password; // 인코딩된 패스워드
    private final String name;

    public static Account of(String username, String password, String name) {
        return new Account(username, password, name);
    }
}
