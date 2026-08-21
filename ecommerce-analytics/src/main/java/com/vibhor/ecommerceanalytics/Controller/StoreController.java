package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Entity.OrderStatus;
import com.vibhor.ecommerceanalytics.Service.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@Tag(name = "Storefront", description = "Customer storefront APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class StoreController {

    private final StoreCatalogService catalogService;
    private final CartService cartService;
    private final CheckoutService checkoutService;
    private final StoreOrderService orderService;
    private final OrderStatusService orderStatusService;
    private final StoreCustomerService storeCustomerService;

    public StoreController(
            StoreCatalogService catalogService,
            CartService cartService,
            CheckoutService checkoutService,
            StoreOrderService orderService,
            OrderStatusService orderStatusService,
            StoreCustomerService storeCustomerService
    ) {
        this.catalogService = catalogService;
        this.cartService = cartService;
        this.checkoutService = checkoutService;
        this.orderService = orderService;
        this.orderStatusService = orderStatusService;
        this.storeCustomerService = storeCustomerService;
    }

    @GetMapping("/categories")
    public List<CategoryDTO> categories() {
        return catalogService.listCategories();
    }

    @GetMapping("/products")
    public Page<ProductCardDTO> products(
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 12) Pageable pageable
    ) {
        return catalogService.listProducts(category, search, pageable);
    }

    @GetMapping("/products/{id}")
    public ProductCardDTO product(@PathVariable Integer id) {
        return catalogService.getProduct(id);
    }

    @GetMapping("/products/{id}/reviews")
    public Page<ReviewDTO> productReviews(
            @PathVariable Integer id,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return catalogService.productReviews(id, pageable);
    }

    @PostMapping("/reviews")
    public ReviewDTO createReview(@Valid @RequestBody CreateReviewRequest request) {
        return catalogService.createReview(request);
    }

    @GetMapping("/cart")
    public CartDTO getCart() {
        return cartService.getCart();
    }

    @PostMapping("/cart/items")
    public CartDTO addCartItem(@Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(request);
    }

    @PatchMapping("/cart/items/{id}")
    public CartDTO updateCartItem(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateItem(id, request);
    }

    @DeleteMapping("/cart/items/{id}")
    public CartDTO removeCartItem(@PathVariable Integer id) {
        return cartService.removeItem(id);
    }

    @PostMapping("/checkout")
    public OrderDTO checkout(@Valid @RequestBody CheckoutRequest request) {
        return checkoutService.checkout(request);
    }

    @GetMapping("/orders")
    public Page<OrderDTO> orders(@PageableDefault(size = 10) Pageable pageable) {
        return orderService.myOrders(pageable);
    }

    @GetMapping("/orders/{id}")
    public OrderDTO order(@PathVariable Integer id) {
        return orderService.myOrder(id);
    }

    @PatchMapping("/orders/{id}/cancel")
    public OrderDTO cancelOrder(@PathVariable Integer id) {
        String username = storeCustomerService.currentUser().getUsername();
        orderStatusService.transition(id, OrderStatus.CANCELLED, username, "Cancelled by customer");
        return orderService.myOrder(id);
    }
}
