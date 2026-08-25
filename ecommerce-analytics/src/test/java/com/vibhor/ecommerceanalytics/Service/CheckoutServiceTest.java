package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.CheckoutRequest;
import com.vibhor.ecommerceanalytics.DTO.OrderDTO;
import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.ResourceConflictException;
import com.vibhor.ecommerceanalytics.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Checkout Service & Inventory Deduction Unit Tests")
class CheckoutServiceTest {

    @Mock private CartService cartService;
    @Mock private StoreCustomerService storeCustomerService;
    @Mock private AddressRepository addressRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryLogRepository inventoryLogRepository;
    @Mock private OrderStatusService orderStatusService;
    @Mock private JsonCacheService cache;

    private CheckoutService checkoutService;

    @BeforeEach
    void setUp() {
        checkoutService = new CheckoutService(
                cartService,
                storeCustomerService,
                addressRepository,
                orderRepository,
                orderItemRepository,
                paymentRepository,
                productRepository,
                inventoryLogRepository,
                orderStatusService,
                cache
        );
    }

    @Test
    @DisplayName("Should throw ResourceConflictException when requested quantity exceeds available stock")
    void testInsufficientStockThrowsException() {
        customers customer = new customers();
        customer.setCustomerId(1);

        products product = new products();
        product.setProductId(10);
        product.setProductName("Mechanical Keyboard");
        product.setStock(2); // Only 2 in stock

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(5); // Requesting 5
        item.setUnitPriceSnapshot(BigDecimal.valueOf(2500));

        Cart cart = new Cart();
        cart.setItems(new ArrayList<>(List.of(item)));

        when(storeCustomerService.requireCustomer()).thenReturn(customer);
        when(cartService.getOrCreateCart(customer)).thenReturn(cart);
        when(productRepository.findById(10)).thenReturn(Optional.of(product));

        CheckoutRequest request = new CheckoutRequest();
        request.setPaymentMethod("UPI");
        request.setLine1("123 Tech Street");
        request.setCity("Lucknow");
        request.setState("UP");
        request.setPincode("226010");
        request.setPhone("9876543210");

        assertThrows(ResourceConflictException.class, () -> checkoutService.checkout(request));
        verify(orderRepository, never()).save(any());
        verify(inventoryLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when cart is empty")
    void testEmptyCartThrowsException() {
        customers customer = new customers();
        Cart emptyCart = new Cart();
        emptyCart.setItems(new ArrayList<>());

        when(storeCustomerService.requireCustomer()).thenReturn(customer);
        when(cartService.getOrCreateCart(customer)).thenReturn(emptyCart);

        CheckoutRequest request = new CheckoutRequest();
        request.setPaymentMethod("CARD");

        assertThrows(IllegalArgumentException.class, () -> checkoutService.checkout(request));
    }
}
