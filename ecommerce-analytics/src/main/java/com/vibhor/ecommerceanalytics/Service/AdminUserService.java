package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.UserSummaryDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.InvalidOrderTransitionException;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.Repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
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
    public UserSummaryDTO getUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return toDto(user);
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

    @Transactional
    public UserSummaryDTO updateUser(Integer userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Update username if provided
        if (updates.containsKey("username")) {
            String newUsername = updates.get("username").trim();
            if (!newUsername.isEmpty() && !newUsername.equals(user.getUsername())) {
                // Check if username is already taken
                if (userRepository.findByUsername(newUsername).isPresent()) {
                    throw new IllegalArgumentException("Username already taken: " + newUsername);
                }
                user.setUsername(newUsername);
            }
        }

        // Update password if provided (will be encoded by the caller)
        if (updates.containsKey("password")) {
            String newPassword = updates.get("password").trim();
            if (!newPassword.isEmpty()) {
                user.setPassword(newPassword);
            }
        }

        userRepository.save(user);

        // Update linked customer profile if exists
        var customerOpt = customerRepository.findByUserId(userId);
        if (customerOpt.isPresent()) {
            customers customer = customerOpt.get();
            
            if (updates.containsKey("email")) {
                String email = updates.get("email").trim();
                if (!email.isEmpty()) {
                    customer.setEmail(email);
                }
            }
            if (updates.containsKey("firstName")) {
                String firstName = updates.get("firstName").trim();
                if (!firstName.isEmpty()) {
                    customer.setFirstName(firstName);
                }
            }
            if (updates.containsKey("lastName")) {
                String lastName = updates.get("lastName").trim();
                customer.setLastName(lastName);
            }
            if (updates.containsKey("city")) {
                String city = updates.get("city").trim();
                if (!city.isEmpty()) {
                    customer.setCity(city);
                }
            }
            customerRepository.save(customer);
        }

        return toDto(user);
    }

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Prevent deleting the last admin
        if ("ADMIN".equals(user.getRole())) {
            long adminCount = userRepository.countByRole("ADMIN");
            if (adminCount <= 1) {
                throw new InvalidOrderTransitionException("Cannot delete the last admin user.");
            }
        }

        // Delete linked customer profile first
        var customerOpt = customerRepository.findByUserId(userId);
        if (customerOpt.isPresent()) {
            customers customer = customerOpt.get();
            // Check if customer has orders
            if (customer.getOrders() != null && !customer.getOrders().isEmpty()) {
                throw new DataIntegrityViolationException(
                    "Cannot delete user: customer has " + customer.getOrders().size() + " orders. " +
                    "Remove customer data first or archive instead."
                );
            }
            customerRepository.delete(customer);
        }

        userRepository.delete(user);
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
