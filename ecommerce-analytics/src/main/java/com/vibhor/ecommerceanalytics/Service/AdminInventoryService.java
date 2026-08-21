package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AdminInventoryService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    public AdminInventoryService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            InventoryLogRepository inventoryLogRepository,
            ReviewRepository reviewRepository,
            OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryLogRepository = inventoryLogRepository;
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<InventoryItemDTO> listInventory(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toInventory);
    }

    @Transactional
    public ProductCardDTO createProduct(AdminProductRequest request) {
        categories category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        products p = new products();
        p.setProductName(request.getProductName().trim());
        p.setPrice(request.getPrice());
        p.setStock(request.getStock());
        p.setCategory(category);
        p.setImageUrl(request.getImageUrl());
        p.setCreatedAt(LocalDateTime.now());
        p = productRepository.save(p);

        inventoryLogs log = new inventoryLogs();
        log.setProduct(p);
        log.setStockBefore(0);
        log.setStockAfter(request.getStock());
        log.setChangeType("INITIAL");
        log.setChangeDate(LocalDateTime.now());
        inventoryLogRepository.save(log);

        return toCard(p);
    }

    @Transactional
    public ProductCardDTO updateProduct(Integer productId, AdminProductRequest request) {
        products p = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        categories category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        int before = p.getStock() == null ? 0 : p.getStock();
        p.setProductName(request.getProductName().trim());
        p.setPrice(request.getPrice());
        p.setStock(request.getStock());
        p.setCategory(category);
        p.setImageUrl(request.getImageUrl());
        p = productRepository.save(p);

        if (before != request.getStock()) {
            inventoryLogs log = new inventoryLogs();
            log.setProduct(p);
            log.setStockBefore(before);
            log.setStockAfter(request.getStock());
            log.setChangeType("ADMIN_UPDATE");
            log.setChangeDate(LocalDateTime.now());
            inventoryLogRepository.save(log);
        }

        return toCard(p);
    }

    @Transactional
    public InventoryItemDTO adjustStock(Integer productId, InventoryAdjustRequest request) {
        products p = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        int before = p.getStock() == null ? 0 : p.getStock();
        p.setStock(request.getStock());
        p = productRepository.save(p);

        inventoryLogs log = new inventoryLogs();
        log.setProduct(p);
        log.setStockBefore(before);
        log.setStockAfter(request.getStock());
        log.setChangeType(request.getReason() == null || request.getReason().isBlank()
                ? "MANUAL_ADJUST" : request.getReason().trim());
        log.setChangeDate(LocalDateTime.now());
        inventoryLogRepository.save(log);

        return toInventory(p);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> listReviews(Integer minRating, Integer maxRating, Pageable pageable) {
        return reviewRepository.findFiltered(minRating, maxRating, pageable).map(r -> {
            String name = r.getCustomer().getFirstName()
                    + (r.getCustomer().getLastName() == null ? "" : " " + r.getCustomer().getLastName());
            return ReviewDTO.builder()
                    .reviewId(r.getReviewId())
                    .productId(r.getProduct().getProductId())
                    .productName(r.getProduct().getProductName())
                    .customerId(r.getCustomer().getCustomerId())
                    .customerName(name.trim())
                    .rating(r.getRating())
                    .reviewText(r.getReviewText())
                    .reviewDate(r.getReviewDate())
                    .build();
        });
    }

    private InventoryItemDTO toInventory(products p) {
        int stock = p.getStock() == null ? 0 : p.getStock();
        return InventoryItemDTO.builder()
                .productId(p.getProductId())
                .productName(p.getProductName())
                .categoryId(p.getCategory() == null ? null : p.getCategory().getCategoryId())
                .categoryName(p.getCategory() == null ? null : p.getCategory().getCategoryName())
                .price(p.getPrice())
                .stock(stock)
                .lowStock(stock <= LOW_STOCK_THRESHOLD)
                .lastRestockDate(inventoryLogRepository.findLastChangeDate(p.getProductId()).orElse(null))
                .build();
    }

    // ============================================================
    // Orders
    // ============================================================

    @Transactional(readOnly = true)
    public Page<RecentOrderDTO> listOrders(OrderStatus status, String search, Pageable pageable) {
        return orderRepository.searchAdmin(status, search, pageable).map(o -> {
            String customerName = "";
            if (o.getCustomer() != null) {
                customerName = o.getCustomer().getFirstName()
                        + (o.getCustomer().getLastName() == null ? "" : " " + o.getCustomer().getLastName());
            }
            return RecentOrderDTO.builder()
                    .orderId(o.getOrderId())
                    .customerId(o.getCustomer() == null ? null : o.getCustomer().getCustomerId())
                    .customerName(customerName.trim())
                    .totalAmount(o.getTotalAmount())
                    .status(o.getStatus() == null ? null : o.getStatus().name())
                    .orderDate(o.getOrderDate())
                    .build();
        });
    }

    @Transactional(readOnly = true)
    public orders getOrder(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
    }

    private ProductCardDTO toCard(products p) {
        return ProductCardDTO.builder()
                .productId(p.getProductId())
                .productName(p.getProductName())
                .price(p.getPrice())
                .stock(p.getStock())
                .categoryId(p.getCategory() == null ? null : p.getCategory().getCategoryId())
                .categoryName(p.getCategory() == null ? null : p.getCategory().getCategoryName())
                .imageUrl(p.getImageUrl())
                .avgRating(0.0)
                .reviewCount(0L)
                .build();
    }
}
