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
import java.util.List;

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
        Page<reviews> page;
        if (minRating != null || maxRating != null) {
            page = reviewRepository.findFiltered(minRating, maxRating, pageable);
        } else {
            page = reviewRepository.findAll(pageable);
        }
        return page.map(r -> {
            String name = "Verified Buyer";
            if (r.getCustomer() != null) {
                String first = r.getCustomer().getFirstName() == null ? "" : r.getCustomer().getFirstName();
                String last = r.getCustomer().getLastName() == null ? "" : r.getCustomer().getLastName();
                name = (first + " " + last).trim();
                if (name.isEmpty()) name = "Customer #" + r.getCustomer().getCustomerId();
            }
            return ReviewDTO.builder()
                    .reviewId(r.getReviewId())
                    .productId(r.getProduct() == null ? null : r.getProduct().getProductId())
                    .productName(r.getProduct() == null ? "Product" : r.getProduct().getProductName())
                    .customerId(r.getCustomer() == null ? null : r.getCustomer().getCustomerId())
                    .customerName(name)
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
        Page<orders> page;
        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim();
            try {
                int orderId = Integer.parseInt(s);
                page = orderRepository.findById(orderId)
                        .map(o -> (Page<orders>) new org.springframework.data.domain.PageImpl<>(List.of(o), pageable, 1))
                        .orElseGet(() -> orderRepository.searchByCustomerName(s, pageable));
            } catch (NumberFormatException e) {
                page = orderRepository.searchByCustomerName(s, pageable);
            }
        } else if (status != null) {
            page = orderRepository.findByStatusOrderByOrderDateDesc(status, pageable);
        } else {
            page = orderRepository.findAllByOrderByOrderDateDesc(pageable);
        }

        return page.map(o -> {
            String customerName = "Guest Customer";
            if (o.getCustomer() != null) {
                String first = o.getCustomer().getFirstName() == null ? "" : o.getCustomer().getFirstName();
                String last = o.getCustomer().getLastName() == null ? "" : o.getCustomer().getLastName();
                customerName = (first + " " + last).trim();
                if (customerName.isEmpty()) customerName = "Customer #" + o.getCustomer().getCustomerId();
            }
            return RecentOrderDTO.builder()
                    .orderId(o.getOrderId())
                    .customerId(o.getCustomer() == null ? null : o.getCustomer().getCustomerId())
                    .customerName(customerName)
                    .totalAmount(o.getTotalAmount() == null ? 0.0 : o.getTotalAmount())
                    .status(o.getStatus() == null ? "PENDING" : o.getStatus().name())
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
