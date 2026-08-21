package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.AddCartItemRequest;
import com.vibhor.ecommerceanalytics.DTO.CartDTO;
import com.vibhor.ecommerceanalytics.DTO.UpdateCartItemRequest;
import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.ResourceConflictException;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CartItemRepository;
import com.vibhor.ecommerceanalytics.Repository.CartRepository;
import com.vibhor.ecommerceanalytics.Repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final StoreCustomerService storeCustomerService;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            StoreCustomerService storeCustomerService
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.storeCustomerService = storeCustomerService;
    }

    @Transactional
    public Cart getOrCreateCart(customers customer) {
        return cartRepository.findByCustomer_CustomerId(customer.getCustomerId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setCustomer(customer);
                    cart.setCreatedAt(LocalDateTime.now());
                    cart.setUpdatedAt(LocalDateTime.now());
                    cart.setItems(new ArrayList<>());
                    return cartRepository.save(cart);
                });
    }

    @Transactional(readOnly = true)
    public CartDTO getCart() {
        customers customer = storeCustomerService.requireCustomer();
        Cart cart = getOrCreateCart(customer);
        return toDto(cart);
    }

    @Transactional
    public CartDTO addItem(AddCartItemRequest request) {
        customers customer = storeCustomerService.requireCustomer();
        Cart cart = getOrCreateCart(customer);
        products product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() == null || product.getStock() < request.getQuantity()) {
            throw new ResourceConflictException("Insufficient stock for " + product.getProductName());
        }

        CartItem existing = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId())
                .orElse(null);

        if (existing != null) {
            int newQty = existing.getQuantity() + request.getQuantity();
            if (product.getStock() < newQty) {
                throw new ResourceConflictException("Insufficient stock for " + product.getProductName());
            }
            existing.setQuantity(newQty);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setUnitPriceSnapshot(BigDecimal.valueOf(product.getPrice()).setScale(2, RoundingMode.HALF_UP));
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateItem(Integer cartItemId, UpdateCartItemRequest request) {
        customers customer = storeCustomerService.requireCustomer();
        Cart cart = getOrCreateCart(customer);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (item.getProduct().getStock() < request.getQuantity()) {
            throw new ResourceConflictException("Insufficient stock");
        }
        item.setQuantity(request.getQuantity());
        cart.setUpdatedAt(LocalDateTime.now());
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeItem(Integer cartItemId) {
        customers customer = storeCustomerService.requireCustomer();
        Cart cart = getOrCreateCart(customer);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cart.getItems().remove(item);
        cart.setUpdatedAt(LocalDateTime.now());
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private CartDTO toDto(Cart cart) {
        List<CartDTO.CartItemDTO> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            BigDecimal line = item.getUnitPriceSnapshot()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(line);
            items.add(CartDTO.CartItemDTO.builder()
                    .cartItemId(item.getCartItemId())
                    .productId(item.getProduct().getProductId())
                    .productName(item.getProduct().getProductName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPriceSnapshot())
                    .lineTotal(line)
                    .stockAvailable(item.getProduct().getStock())
                    .build());
        }

        return CartDTO.builder()
                .cartId(cart.getCartId())
                .items(items)
                .total(total)
                .build();
    }
}
