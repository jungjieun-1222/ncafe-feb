package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginRequest;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.config.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final SignupUseCase signupUseCase;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            signupUseCase.signup(request);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.createToken(authentication);

        return ResponseEntity.ok(Map.of(
            "token", jwt,
            "username", authentication.getName()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }
        
        return ResponseEntity.ok(Map.of(
            "username", authentication.getName(),
            "role", authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .findFirst().orElse("ROLE_USER"),
            "roles", authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList())
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT doesn't need server-side logout, 
        // but BFF will destroy the session cookie.
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
