package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.CustomerRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.CustomerResponseDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    @GetMapping
    public List<CustomerResponseDTO> getallCustomer()
    {
        return  customerService.getAllCustomers();
    }
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerbyId(@PathVariable Integer id)
    {
        Optional<CustomerResponseDTO> customer = customerService.getCustomerbyId(id); //returns with customer with ID

        if(customer.isPresent()) //checks
        {
            return ResponseEntity.ok(customer.get());
        }

        return ResponseEntity.notFound().build();
    }
        @PostMapping //ResponseEntity Can also be used to know the error code
            public  CustomerResponseDTO addCustomer(
                @Valid  @RequestBody CustomerRequestDTO dto)
        {
            return  customerService.addCustomer(dto);
        }
    @PutMapping("/{id}")
        public  ResponseEntity<CustomerResponseDTO> UpdateCustomer(@PathVariable  Integer id, @Valid @RequestBody  CustomerRequestDTO dto)

    {
        CustomerResponseDTO update = customerService.UpdateCustomer(id,dto);
        return  ResponseEntity.ok(update);
    }
    @DeleteMapping("/{id}")
        public  ResponseEntity<Void> DeleteCustomer(@PathVariable Integer id)
    {
    customerService.DeleteCustomer(id);
    return ResponseEntity.notFound().build();
    }
}
