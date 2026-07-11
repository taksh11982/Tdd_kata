package com.study.prep.backend.config;

import com.study.prep.backend.entity.Role;
import com.study.prep.backend.entity.User;
import com.study.prep.backend.repository.UserRepository;
import com.study.prep.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@cardealership.com";

        User existing = userRepository.findByEmail(adminEmail).orElse(null);

        if (existing == null) {
            User admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            logAdminToken(adminEmail);
        } else if (existing.getRole() != Role.ADMIN) {
            existing.setRole(Role.ADMIN);
            existing.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(existing);
            log.info("User {} upgraded to ADMIN role", adminEmail);
            logAdminToken(adminEmail);
        } else {
            logAdminToken(adminEmail);
        }
    }

    private void logAdminToken(String email) {
        String token = jwtUtil.generateToken(email);
        log.info("========================================");
        log.info("Admin JWT Token (copy this for Postman):");
        log.info("{}", token);
        log.info("========================================");
    }
}
