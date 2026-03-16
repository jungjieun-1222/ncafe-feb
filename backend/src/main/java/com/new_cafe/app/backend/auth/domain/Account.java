package com.new_cafe.app.backend.auth.domain;

import lombok.Getter;

@Getter
public class Account {
    private final String id;
    private final String username;
    private final String name;
    private final String nickname;
    private final String email;
    private final String phone;
    private final String password;
    private final String role;

    private Account(String id, String username, String name, String nickname, String email, String phone, String password, String role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    public static Account of(String id, String username, String name, String nickname, String email, String phone, String password, String role) {
        return new Account(id, username, name, nickname, email, phone, password, role);
    }

    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getNickname() { return nickname; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}
