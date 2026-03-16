package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.adapter.in.web.dto.LoginRequest;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.SignupRequest;
import com.new_cafe.app.backend.auth.adapter.in.web.dto.WithdrawRequest;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.port.in.WithdrawUseCase;
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
    private final WithdrawUseCase withdrawUseCase;
    private final com.new_cafe.app.backend.auth.adapter.out.persistence.repository.UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            signupUseCase.signup(request);
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.createToken(authentication);

            // Use loginUseCase to fetch full user details as requested
            var user = loginUseCase.login(new LoginCommand(request.getUsername(), request.getPassword()))
                                   .orElse(null);

            log.info("Login success for user: {}", request.getUsername());
            
            java.util.Map<String, Object> userMap = new java.util.HashMap<>();
            if (user != null) {
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("nickname", user.getNickname());
                userMap.put("name", user.getName());
                userMap.put("phone", user.getPhone());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole());
            } else {
                // Fallback to authentication authorities if service fails
                userMap.put("username", authentication.getName());
                userMap.put("role", authentication.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .findFirst().orElse("ROLE_USER"));
            }

            return ResponseEntity.ok(java.util.Map.of(
                "token", jwt,
                "user", userMap
            ));
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.warn("Login failed for user {}: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다."));
        } catch (Exception e) {
            log.error("Unexpected error during login: ", e);
            return ResponseEntity.status(500).body(Map.of("message", "서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSession(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }
        
        // Load user by username (principal name in jwt/security context)
        var user = userRepository.findByUsername(authentication.getName()).orElse(null);
        
        java.util.Map<String, Object> userMap = new java.util.HashMap<>();
        if (user != null) {
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("nickname", user.getNickname());
            userMap.put("name", user.getName());
            userMap.put("phone", user.getPhone());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
        } else {
            userMap.put("username", authentication.getName());
            userMap.put("role", authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .findFirst().orElse("ROLE_USER"));
        }

        return ResponseEntity.ok(Map.of("user", userMap));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userRepository.existsByUsername(username);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean exists = userRepository.existsByNickname(nickname);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT doesn't need server-side logout, 
        // but BFF will destroy the session cookie.
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody WithdrawRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));
        }

        try {
            withdrawUseCase.withdraw(authentication.getName(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Account withdrawn successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
