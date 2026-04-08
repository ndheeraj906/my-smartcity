package com.smartcity.ecommerce.config;

import com.smartcity.ecommerce.model.Role;
import com.smartcity.ecommerce.model.User;
import com.smartcity.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@smartcity.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .role(Role.ADMIN)
                        .blocked(false)
                        .build();
                userRepository.save(admin);
                System.out.println("Default admin user created: admin/admin123");
            }
        };
    }
}
