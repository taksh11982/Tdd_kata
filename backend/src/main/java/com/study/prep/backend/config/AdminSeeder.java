package com.study.prep.backend.config;

import com.study.prep.backend.entity.Role;
import com.study.prep.backend.entity.User;
import com.study.prep.backend.entity.Vehicle;
import com.study.prep.backend.repository.UserRepository;
import com.study.prep.backend.repository.VehicleRepository;
import com.study.prep.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedVehicles();
    }

    private void seedAdmin() {
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

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) {
            log.info("Vehicles already seeded, skipping...");
            return;
        }

        List<Vehicle> vehicles = List.of(
            Vehicle.builder().make("Toyota").model("Camry").category("Sedan").price(new BigDecimal("28500")).quantity(12).build(),
            Vehicle.builder().make("Honda").model("Civic").category("Sedan").price(new BigDecimal("25200")).quantity(8).build(),
            Vehicle.builder().make("Ford").model("Mustang").category("Sports").price(new BigDecimal("55000")).quantity(3).build(),
            Vehicle.builder().make("Tesla").model("Model 3").category("Electric").price(new BigDecimal("42000")).quantity(15).build(),
            Vehicle.builder().make("BMW").model("X5").category("SUV").price(new BigDecimal("62000")).quantity(5).build(),
            Vehicle.builder().make("Chevrolet").model("Silverado").category("Truck").price(new BigDecimal("48000")).quantity(2).build(),
            Vehicle.builder().make("Mercedes-Benz").model("C-Class").category("Sedan").price(new BigDecimal("52000")).quantity(0).build(),
            Vehicle.builder().make("Jeep").model("Wrangler").category("SUV").price(new BigDecimal("38000")).quantity(7).build(),
            Vehicle.builder().make("Porsche").model("911").category("Sports").price(new BigDecimal("120000")).quantity(1).build(),
            Vehicle.builder().make("Rivian").model("R1T").category("Truck").price(new BigDecimal("73000")).quantity(4).build()
        );

        vehicleRepository.saveAll(vehicles);
        log.info("Seeded {} vehicles into database", vehicles.size());
    }

    private void logAdminToken(String email) {
        String token = jwtUtil.generateToken(email);
        log.info("========================================");
        log.info("Admin JWT Token (copy this for Postman):");
        log.info("{}", token);
        log.info("========================================");
    }
}
