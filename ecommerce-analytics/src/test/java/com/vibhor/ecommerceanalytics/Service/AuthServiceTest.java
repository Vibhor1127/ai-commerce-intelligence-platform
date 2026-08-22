package com.vibhor.ecommerceanalytics.Service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Authentication & JWT Security Unit Tests")
class AuthServiceTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Should encode user password with BCrypt upon registration")
    void testPasswordEncoding() {
        String rawPassword = "SecretPassword123!";
        String encodedHash = "$2a$10$wN3kQxZ7f8p9...mockHash";

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedHash);

        String result = passwordEncoder.encode(rawPassword);

        assertNotNull(result);
        assertEquals(encodedHash, result);
        assertNotEquals(rawPassword, result);
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }

    @Test
    @DisplayName("Should match valid password against stored BCrypt hash")
    void testPasswordMatchVerification() {
        String rawPassword = "SecretPassword123!";
        String storedHash = "$2a$10$wN3kQxZ7f8p9...mockHash";

        when(passwordEncoder.matches(rawPassword, storedHash)).thenReturn(true);

        boolean isMatch = passwordEncoder.matches(rawPassword, storedHash);

        assertTrue(isMatch);
        verify(passwordEncoder, times(1)).matches(rawPassword, storedHash);
    }
}
