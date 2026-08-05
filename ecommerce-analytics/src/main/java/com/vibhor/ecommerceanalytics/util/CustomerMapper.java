package com.vibhor.ecommerceanalytics.util;

import com.vibhor.ecommerceanalytics.DTO.CustomerRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.CustomerResponseDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;

public class CustomerMapper {
            //Entity -> Response DTO
                public  static CustomerResponseDTO entityToDto(customers customer)
                {
                    CustomerResponseDTO dto = new CustomerResponseDTO();
                    dto.setFirst_name(customer.getFirstName());
                    dto.setLast_name(customer.getLastName());
                    dto.setEmail(customer.getEmail());
                    dto.setCity(customer.getCity());
                    return dto;
                }
                        //DTO -> Entity
                public static customers DtoToEntity(CustomerRequestDTO customerRequestDTO)
                {
                    customers customers = new customers();
                    customers.setFirstName(customerRequestDTO.getFirstName());
                    customers.setLastName(customerRequestDTO.getLastName());
                    customers.setCity(customerRequestDTO.getCity());
                    customers.setEmail(customerRequestDTO.getEmail());
                    customers.setSignupDate(customerRequestDTO.getSignupDate());
                    return  customers;
                }
}
