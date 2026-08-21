package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Entity.OrderStatus;
import com.vibhor.ecommerceanalytics.Service.AdminInventoryService;
import com.vibhor.ecommerceanalytics.Service.AdminUserService;
import com.vibhor.ecommerceanalytics.Service.OrderStatusService;
import com.vibhor.ecommerceanalytics.Service.StoreCustomerService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Shopkeeper", description = "Inventory, products, orders, and reviews for admins")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {

    private final AdminInventoryService adminInventoryService;
    private final OrderStatusService orderStatusService;
    private final StoreCustomerService storeCustomerService;
    private final AdminUserService adminUserService;

    public AdminController(
            AdminInventoryService adminInventoryService,
            OrderStatusService orderStatusService,
            StoreCustomerService storeCustomerService,
            AdminUserService adminUserService
    ) {
        this.adminInventoryService = adminInventoryService;
        this.orderStatusService = orderStatusService;
        this.storeCustomerService = storeCustomerService;
        this.adminUserService = adminUserService;
    }

    // ============================================================
    // Reviews
    // ============================================================

    @GetMapping("/reviews")
    public Page<ReviewDTO> reviews(
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return adminInventoryService.listReviews(minRating, maxRating, pageable);
    }

    // ============================================================
    // Inventory
    // ============================================================

    @GetMapping("/inventory")
    public Page<InventoryItemDTO> inventory(@PageableDefault(size = 20) Pageable pageable) {
        return adminInventoryService.listInventory(pageable);
    }

    @PatchMapping("/inventory/{productId}")
    public InventoryItemDTO adjustInventory(
            @PathVariable Integer productId,
            @Valid @RequestBody InventoryAdjustRequest request
    ) {
        return adminInventoryService.adjustStock(productId, request);
    }

    // ============================================================
    // Products
    // ============================================================

    @PostMapping("/products")
    public ProductCardDTO createProduct(@Valid @RequestBody AdminProductRequest request) {
        return adminInventoryService.createProduct(request);
    }

    @PatchMapping("/products/{id}")
    public ProductCardDTO updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody AdminProductRequest request
    ) {
        return adminInventoryService.updateProduct(id, request);
    }

    // ============================================================
    // Orders — Admin management
    // ============================================================

    @GetMapping("/orders")
    public Page<RecentOrderDTO> adminOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return adminInventoryService.listOrders(status, search, pageable);
    }

    @PatchMapping("/orders/{id}/status")
    public OrderStatusHistoryDTO updateOrderStatus(
            @PathVariable Integer id,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        String username = storeCustomerService.currentUser().getUsername();
        orderStatusService.transition(id, request.getNewStatus(), username, request.getNote());
        // Return the latest history entry
        List<OrderStatusHistoryDTO> history = orderStatusService.getHistory(id);
        return history.isEmpty() ? null : history.get(0);
    }

    @GetMapping("/orders/{id}/history")
    public List<OrderStatusHistoryDTO> orderHistory(@PathVariable Integer id) {
        return orderStatusService.getHistory(id);
    }

    @GetMapping("/orders/{id}/transitions")
    public Set<OrderStatus> validTransitions(@PathVariable Integer id) {
        var order = adminInventoryService.getOrder(id);
        return orderStatusService.validTransitions(order.getStatus());
    }

    // ============================================================
    // User Management
    // ============================================================

    @GetMapping("/users")
    public Page<UserSummaryDTO> listUsers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return adminUserService.listUsers(search, pageable);
    }

    @PatchMapping("/users/{id}/role")
    public UserSummaryDTO updateUserRole(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        String username = storeCustomerService.currentUser().getUsername();
        String role = body.get("role");
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("role is required");
        }
        return adminUserService.updateRole(id, role.trim().toUpperCase(), username);
    }
}
