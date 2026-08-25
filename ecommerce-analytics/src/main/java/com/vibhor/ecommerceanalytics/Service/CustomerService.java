package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.CustomerRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.CustomerResponseDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.CustomerNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.util.CustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JsonCacheService cache;

    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerMapper::entityToDto)
                .toList();
    }

    public Optional<CustomerResponseDTO> getCustomerbyId(Integer id) {
        return customerRepository.findById(id).map(CustomerMapper::entityToDto);
    }

    public CustomerResponseDTO addCustomer(CustomerRequestDTO dto) {
        customers customer = CustomerMapper.DtoToEntity(dto);
        customers savedCustomer = customerRepository.save(customer);
        cache.evictAll("analytics");
        cache.evictAll("dashboard");
        return CustomerMapper.entityToDto(savedCustomer);
    }

    public CustomerResponseDTO UpdateCustomer(Integer id, CustomerRequestDTO dto) {
        Optional<customers> existing = customerRepository.findById(id);
        if (existing.isPresent()) {
            customers oldcustomer = existing.get();
            oldcustomer.setFirstName(dto.getFirstName());
            oldcustomer.setLastName(dto.getLastName());
            oldcustomer.setEmail(dto.getEmail());
            oldcustomer.setCity(dto.getCity());
            oldcustomer.setSignupDate(dto.getSignupDate());

            customers savedCustomer = customerRepository.save(oldcustomer);
            cache.evictAll("analytics");
            cache.evictAll("dashboard");
            return CustomerMapper.entityToDto(savedCustomer);
        } else {
            throw new CustomerNotFoundException(id);
        }
    }

    public void DeleteCustomer(Integer id) {
        customerRepository.deleteById(id);
        cache.evictAll("analytics");
        cache.evictAll("dashboard");
    }
}
