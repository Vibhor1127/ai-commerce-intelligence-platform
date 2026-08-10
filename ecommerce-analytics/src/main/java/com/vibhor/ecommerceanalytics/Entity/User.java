package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String username;

    private String password;

    private String role;

    // Spring Security asks: What permissions does this user have?
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );
    }

    // We are using username for login
    @Override
    public String getUsername() {
        return username;
    }

    // Account is active
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // Account is not locked
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Credentials are still valid
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // User is enabled
    @Override
    public boolean isEnabled() {
        return true;
    }
}