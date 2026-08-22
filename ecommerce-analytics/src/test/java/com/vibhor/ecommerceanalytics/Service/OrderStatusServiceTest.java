package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.InvalidOrderTransitionException;
import com.vibhor.ecommerceanalytics.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Order Status State Machine & Restock Unit Tests")
class OrderStatusServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderStatusHistoryRepository historyRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryLogRepository inventoryLogRepository;

    private OrderStatusService orderStatusService;

    @BeforeEach
    void setUp() {
        orderStatusService = new OrderStatusService(
                orderRepository,
                historyRepository,
                productRepository,
                inventoryLogRepository
        );
    }

    @Test
    @DisplayName("Should successfully transition order from PENDING to PROCESSING")
    void testValidTransition() {
        orders order = new orders();
        order.setOrderId(101);
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(101)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(orders.class))).thenAnswer(invocation -> invocation.getArgument(0));

        orders result = orderStatusService.transition(101, OrderStatus.PROCESSING, "admin", "Payment verified");

        assertNotNull(result);
        assertEquals(OrderStatus.PROCESSING, result.getStatus());
        verify(historyRepository, times(1)).save(any(OrderStatusHistory.class));
    }

    @Test
    @DisplayName("Should reject illegal transition from PENDING directly to REFUNDED")
    void testIllegalTransitionThrowsException() {
        orders order = new orders();
        order.setOrderId(102);
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(102)).thenReturn(Optional.of(order));

        assertThrows(InvalidOrderTransitionException.class, () ->
                orderStatusService.transition(102, OrderStatus.REFUNDED, "admin", "Illegal jump")
        );
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should automatically restock inventory when order is CANCELLED")
    void testRestockOnCancellation() {
        products product = new products();
        product.setProductId(5);
        product.setStock(10); // Current stock is 10

        orderItem item = new orderItem();
        item.setProduct(product);
        item.setQuantity(3); // Order had 3 items

        orders order = new orders();
        order.setOrderId(103);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderItems(new ArrayList<>(List.of(item)));

        when(orderRepository.findById(103)).thenReturn(Optional.of(order));
        when(productRepository.findById(5)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(orders.class))).thenAnswer(invocation -> invocation.getArgument(0));

        orderStatusService.transition(103, OrderStatus.CANCELLED, "customer", "User cancelled order");

        // Stock should have increased from 10 to 13
        assertEquals(13, product.getStock());
        verify(productRepository, times(1)).save(product);
        verify(inventoryLogRepository, times(1)).save(any(inventoryLogs.class));
    }
}
