package com.vibhor.ecommerceanalytics.Config;

import com.vibhor.ecommerceanalytics.Security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.e2b.app",
                "https://*.arena.ai"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )
                .csrf(csrf ->
                        csrf.disable()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                            String json = String.format(
                                    "{\"timestamp\":\"%s\",\"status\":401,\"message\":\"Unauthorized: Invalid credentials or session expired\"}",
                                    java.time.LocalDateTime.now()
                            );
                            response.getWriter().write(json);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                            String json = String.format(
                                    "{\"timestamp\":\"%s\",\"status\":403,\"message\":\"Forbidden: Insufficient permissions\"}",
                                    java.time.LocalDateTime.now()
                            );
                            response.getWriter().write(json);
                        })
                )
                .authorizeHttpRequests(auth -> auth

                        // Auth endpoints (register + login) - Public
                        .requestMatchers(
                                "/auth/**"
                        )
                        .permitAll()

                        // Swagger & OpenAPI docs - Public
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        )
                        .permitAll()

                        // AI Capabilities & Health - Public
                        .requestMatchers(
                                "/ai/health",
                                "/ai/capabilities"
                        )
                        .permitAll()

                        // Storefront - shoppers and admins (admins may browse for testing)
                        .requestMatchers("/api/store/**")
                        .hasAnyRole("USER", "ADMIN")

                        // Admin shopkeeper console
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // AI Query Endpoint - Protected by JWT
                        .requestMatchers(
                                "/ai/ask"
                        )
                        .authenticated()

                        // Analytics endpoints - Protected by JWT
                        .requestMatchers(
                                "/analytics/**"
                        )
                        .authenticated()

                        // Customer CRUD APIs - Protected by JWT
                        .requestMatchers(
                                "/api/customers/**"
                        )
                        .authenticated()

                        // All other endpoints require authentication
                        .anyRequest()
                        .authenticated()
                )
                // Register JWT filter BEFORE Spring's default auth filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
