package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.CheckoutRequest;
import com.vibhor.ecommerceanalytics.DTO.OrderDTO;
import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.ResourceConflictException;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Checkout places a real order from the cart.
 * Payment gateway is SIMULATED (~90% success) — not a real processor.
 */
@Service
public class CheckoutService {

    private final CartService cartService;
    private final StoreCustomerService storeCustomerService;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final OrderStatusService orderStatusService;
    private final JsonCacheService cache;

    public CheckoutService(
            CartService cartService,
            StoreCustomerService storeCustomerService,
            AddressRepository addressRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PaymentRepository paymentRepository,
            ProductRepository productRepository,
            InventoryLogRepository inventoryLogRepository,
            OrderStatusService orderStatusService,
            JsonCacheService cache
    ) {
        this.cartService = cartService;
        this.storeCustomerService = storeCustomerService;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.orderStatusService = orderStatusService;
        this.cache = cache;
    }

    @Transactional
    public OrderDTO checkout(CheckoutRequest request) {
        customers customer = storeCustomerService.requireCustomer();
        Cart cart = cartService.getOrCreateCart(customer);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        String method = normalizePaymentMethod(request.getPaymentMethod());
        Address shipping = resolveAddress(customer, request);

        for (CartItem item : cart.getItems()) {
            products product = productRepository.findById(item.getProduct().getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product missing"));
            if (product.getStock() == null || product.getStock() < item.getQuantity()) {
                throw new ResourceConflictException(
                        "Insufficient stock for product: " + product.getProductName());
            }
        }

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            total = total.add(item.getUnitPriceSnapshot()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        orders order = new orders();
        order.setCustomer(customer);
        order.setShippingAddress(shipping);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(total.doubleValue());
        order = orderRepository.save(order);

        List<orderItem> savedItems = new ArrayList<>();
        for (CartItem item : new ArrayList<>(cart.getItems())) {
            products product = productRepository.findById(item.getProduct().getProductId()).orElseThrow();

            orderItem oi = new orderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(item.getQuantity());
            oi.setPrice(item.getUnitPriceSnapshot().doubleValue());
            savedItems.add(orderItemRepository.save(oi));

            int before = product.getStock();
            int after = before - item.getQuantity();
            product.setStock(after);
            productRepository.save(product);

            inventoryLogs log = new inventoryLogs();
            log.setProduct(product);
            log.setStockBefore(before);
            log.setStockAfter(after);
            log.setChangeType("SALE");
            log.setChangeDate(LocalDateTime.now());
            inventoryLogRepository.save(log);
        }

        boolean success = "COD".equals(method) || ThreadLocalRandom.current().nextDouble() < 0.90;
        payments payment = new payments();
        payment.setOrder(order);
        payment.setAmount(total.doubleValue());
        payment.setPaymentMethod(method);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(success ? "SUCCESS" : "FAILED");
        paymentRepository.save(payment);

        String username = storeCustomerService.currentUser().getUsername();
        if (success) {
            orderStatusService.transition(order.getOrderId(), OrderStatus.PROCESSING, username, "Payment successful");
        } else {
            orderStatusService.transition(order.getOrderId(), OrderStatus.CANCELLED, username, "Payment failed");
        }
        cartService.clearCart(cart);

        // Evict all analytics caches — order counts, revenue, inventory, and dashboard KPIs
        cache.evictAll("analytics");
        cache.evictAll("dashboard");

        return OrderMapper.toDto(order, savedItems, payment, shipping);
    }

    private Address resolveAddress(customers customer, CheckoutRequest request) {
        if (request.getAddressId() != null) {
            Address existing = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
            if (!existing.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
                throw new ResourceNotFoundException("Address not found");
            }
            return existing;
        }

        requireNonBlank(request.getLine1(), "Shipping address line1 is required");
        requireNonBlank(request.getCity(), "Shipping city is required");
        requireNonBlank(request.getState(), "Shipping state is required");
        requireNonBlank(request.getPincode(), "Shipping pincode is required");
        requireNonBlank(request.getPhone(), "Shipping phone is required");

        Address address = new Address();
        address.setCustomer(customer);
        address.setLine1(request.getLine1().trim());
        address.setLine2(request.getLine2() == null ? null : request.getLine2().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setPhone(request.getPhone().trim());
        address.setIsDefault(true);
        return addressRepository.save(address);
    }

    private String normalizePaymentMethod(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("paymentMethod is required (CARD, UPI, or COD)");
        }
        String m = raw.trim().toUpperCase(Locale.ROOT);
        return switch (m) {
            case "CARD", "CREDIT CARD", "CREDIT_CARD" -> "CARD";
            case "UPI" -> "UPI";
            case "COD", "CASH ON DELIVERY" -> "COD";
            default -> throw new IllegalArgumentException("Unsupported paymentMethod: " + raw);
        };
    }

    private void requireNonBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }
}
