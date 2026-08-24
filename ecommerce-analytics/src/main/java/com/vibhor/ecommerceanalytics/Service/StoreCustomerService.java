package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.CustomerProfileDTO;
import com.vibhor.ecommerceanalytics.DTO.UpdateProfileRequestDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreCustomerService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public StoreCustomerService(UserRepository userRepository, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    public User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Not authenticated");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public customers requireCustomer() {
        User user = currentUser();
        return customerRepository.findByUserId(user.getUserId())
                .orElseGet(() -> {
                    customers c = new customers();
                    c.setUserId(user.getUserId());
                    c.setFirstName(user.getUsername());
                    c.setLastName(user.getRole() == null ? "User" : user.getRole());
                    c.setEmail(user.getUsername() + "@aci-commerce.internal");
                    c.setCity("Mumbai");
                    c.setSignupDate(java.time.LocalDate.now());
                    return customerRepository.save(c);
                });
    }

    public CustomerProfileDTO getProfile() {
        return toDto(requireCustomer());
    }

    @Transactional
    public CustomerProfileDTO updateProfile(UpdateProfileRequestDTO dto) {
        customers customer = requireCustomer();
        customer.setFirstName(dto.getFirstName().trim());
        customer.setLastName(dto.getLastName() == null ? null : dto.getLastName().trim());
        customer.setCity(dto.getCity().trim());
        return toDto(customerRepository.save(customer));
    }

    private CustomerProfileDTO toDto(customers c) {
        return new CustomerProfileDTO(
                c.getCustomerId(),
                c.getFirstName(),
                c.getLastName(),
                c.getEmail(),
                c.getCity(),
                c.getSignupDate()
        );
    }
}
