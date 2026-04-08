package com.smartcity.ecommerce.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    // 64-byte secret key to satisfy HMAC-SHA512 minimum requirement
    private static final String SECRET =
            "test-secret-key-which-is-long-enough-for-hmac-sha512-algorithm-ok";
    private static final long EXPIRATION_MS = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", EXPIRATION_MS);
    }

    @Test
    void generateToken_validInput_returnsNonNullToken() {
        // Act
        String token = jwtUtil.generateToken("alice", "CUSTOMER");

        // Assert
        assertThat(token).isNotBlank();
    }

    @Test
    void extractUsername_fromGeneratedToken_returnsCorrectUsername() {
        // Arrange
        String token = jwtUtil.generateToken("alice", "CUSTOMER");

        // Act
        String username = jwtUtil.extractUsername(token);

        // Assert
        assertThat(username).isEqualTo("alice");
    }

    @Test
    void extractRole_fromGeneratedToken_returnsCorrectRole() {
        // Arrange
        String token = jwtUtil.generateToken("alice", "SELLER");

        // Act
        String role = jwtUtil.extractRole(token);

        // Assert
        assertThat(role).isEqualTo("SELLER");
    }

    @Test
    void validateToken_validToken_returnsTrue() {
        // Arrange
        String token = jwtUtil.generateToken("alice", "CUSTOMER");

        // Act
        boolean valid = jwtUtil.validateToken(token);

        // Assert
        assertThat(valid).isTrue();
    }

    @Test
    void validateToken_tamperedToken_returnsFalse() {
        // Arrange — append garbage to invalidate the signature
        String token = jwtUtil.generateToken("alice", "CUSTOMER") + "tampered";

        // Act
        boolean valid = jwtUtil.validateToken(token);

        // Assert
        assertThat(valid).isFalse();
    }

    @Test
    void validateToken_emptyString_returnsFalse() {
        // Act
        boolean valid = jwtUtil.validateToken("");

        // Assert
        assertThat(valid).isFalse();
    }
}
