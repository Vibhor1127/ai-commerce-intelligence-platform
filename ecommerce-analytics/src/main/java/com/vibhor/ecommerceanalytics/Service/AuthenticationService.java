package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.AuthResponseDTO;
import com.vibhor.ecommerceanalytics.DTO.LoginRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.RegisterRequestDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    // Register a new user
    public String register(RegisterRequestDTO dto) {

        User user = new User();

        user.setUsername(dto.getUsername());

        // Never store plain password
        user.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );

        // Use requested role if provided, default to USER
        String requestedRole = dto.getRole();
        if (requestedRole != null && !requestedRole.isBlank()) {
            user.setRole(requestedRole.toUpperCase());
        } else {
            user.setRole("USER");
        }

        userRepository.save(user);

        return "User registered successfully";
    }


    // Login existing user
    public AuthResponseDTO login(LoginRequestDTO dto) {

        // Spring Security checks username + password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                )
        );

        // Load user after successful authentication
        User user = userRepository
                .findByUsername(dto.getUsername())
                .orElseThrow();

        // Generate JWT
        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token);
    }
}