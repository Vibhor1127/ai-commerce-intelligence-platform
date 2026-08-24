package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.OrderDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Entity.orders;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreOrderService {

    private final OrderRepository orderRepository;
    private final StoreCustomerService storeCustomerService;

    public StoreOrderService(OrderRepository orderRepository, StoreCustomerService storeCustomerService) {
        this.orderRepository = orderRepository;
        this.storeCustomerService = storeCustomerService;
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> myOrders(Pageable pageable) {
        var customer = storeCustomerService.requireCustomer();
        return orderRepository
                .findByCustomer_CustomerIdOrderByOrderDateDesc(customer.getCustomerId(), pageable)
                .map(OrderMapper::toDto);
    }

    @Transactional(readOnly = true)
    public OrderDTO myOrder(Integer orderId) {
        User user = storeCustomerService.currentUser();
        var customer = storeCustomerService.requireCustomer();
        orders order = orderRepository.findByOrderIdAndCustomer_CustomerId(orderId, customer.getCustomerId())
                .or(() -> ("ADMIN".equalsIgnoreCase(user.getRole()) || "ANALYST".equalsIgnoreCase(user.getRole()))
                        ? orderRepository.findById(orderId)
                        : java.util.Optional.empty())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: #" + orderId));
        return OrderMapper.toDto(order);
    }
}
