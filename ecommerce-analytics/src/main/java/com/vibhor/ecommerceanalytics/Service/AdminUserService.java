package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.UserSummaryDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.InvalidOrderTransitionException;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.Repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AdminUserService {

    private static final Set<String> VALID_ROLES = Set.of("USER", "ADMIN", "ANALYST");

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public AdminUserService(UserRepository userRepository, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDTO> listUsers(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return userRepository.findAll(pageable).map(this::toDto);
        }
        return userRepository.findByUsernameContainingIgnoreCase(search.trim(), pageable)
                .map(this::toDto);
    }

    @Transactional
    public UserSummaryDTO updateRole(Integer userId, String newRole, String changedBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (!VALID_ROLES.contains(newRole)) {
            throw new IllegalArgumentException("Invalid role: " + newRole + ". Must be USER, ADMIN, or ANALYST.");
        }

        // Prevent self-demotion
        if (user.getUsername().equals(changedBy) && !newRole.equals(user.getRole())) {
            throw new InvalidOrderTransitionException("Cannot change your own role. Ask another admin to do it.");
        }

        user.setRole(newRole);
        userRepository.save(user);
        return toDto(user);
    }

    private UserSummaryDTO toDto(User user) {
        var customer = customerRepository.findByUserId(user.getUserId());
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .role(user.getRole())
                .linkedCustomer(customer.isPresent())
                .customerEmail(customer.map(customers::getEmail).orElse(user.getUsername() + "@aci-commerce.internal"))
                .build();
    }
}
