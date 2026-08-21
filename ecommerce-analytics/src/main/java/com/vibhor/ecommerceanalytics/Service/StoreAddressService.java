package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.AddressRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.AddressResponseDTO;
import com.vibhor.ecommerceanalytics.Entity.Address;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreAddressService {

    private final AddressRepository addressRepository;
    private final StoreCustomerService storeCustomerService;

    public StoreAddressService(AddressRepository addressRepository, StoreCustomerService storeCustomerService) {
        this.addressRepository = addressRepository;
        this.storeCustomerService = storeCustomerService;
    }

    @Transactional(readOnly = true)
    public List<AddressResponseDTO> listAddresses() {
        customers customer = storeCustomerService.requireCustomer();
        return addressRepository.findByCustomer_CustomerId(customer.getCustomerId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponseDTO addAddress(AddressRequestDTO request) {
        customers customer = storeCustomerService.requireCustomer();

        Address address = new Address();
        address.setCustomer(customer);
        address.setLine1(request.getLine1().trim());
        address.setLine2(request.getLine2() == null ? null : request.getLine2().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setPhone(request.getPhone().trim());

        // First address is automatically the default
        List<Address> existing = addressRepository.findByCustomer_CustomerId(customer.getCustomerId());
        address.setIsDefault(existing.isEmpty());

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public AddressResponseDTO updateAddress(Integer addressId, AddressRequestDTO request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        customers customer = storeCustomerService.requireCustomer();
        if (!address.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new ResourceNotFoundException("Address not found");
        }

        address.setLine1(request.getLine1().trim());
        address.setLine2(request.getLine2() == null ? null : request.getLine2().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setPhone(request.getPhone().trim());

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        customers customer = storeCustomerService.requireCustomer();
        if (!address.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new ResourceNotFoundException("Address not found");
        }

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        // If we deleted the default, promote the first remaining address
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByCustomer_CustomerId(customer.getCustomerId());
            if (!remaining.isEmpty()) {
                remaining.get(0).setIsDefault(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }

    @Transactional
    public void setDefault(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        customers customer = storeCustomerService.requireCustomer();
        if (!address.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new ResourceNotFoundException("Address not found");
        }

        // Unset all current defaults
        List<Address> all = addressRepository.findByCustomer_CustomerId(customer.getCustomerId());
        for (Address a : all) {
            if (Boolean.TRUE.equals(a.getIsDefault())) {
                a.setIsDefault(false);
                addressRepository.save(a);
            }
        }

        address.setIsDefault(true);
        addressRepository.save(address);
    }

    private AddressResponseDTO toDto(Address a) {
        return AddressResponseDTO.builder()
                .addressId(a.getAddressId())
                .line1(a.getLine1())
                .line2(a.getLine2())
                .city(a.getCity())
                .state(a.getState())
                .pincode(a.getPincode())
                .phone(a.getPhone())
                .isDefault(a.getIsDefault())
                .build();
    }
}
