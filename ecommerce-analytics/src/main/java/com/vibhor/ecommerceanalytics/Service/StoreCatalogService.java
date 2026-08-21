package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Entity.categories;
import com.vibhor.ecommerceanalytics.Entity.products;
import com.vibhor.ecommerceanalytics.Entity.reviews;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.CategoryRepository;
import com.vibhor.ecommerceanalytics.Repository.ProductRepository;
import com.vibhor.ecommerceanalytics.Repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreCatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final StoreCustomerService storeCustomerService;

    public StoreCatalogService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ReviewRepository reviewRepository,
            StoreCustomerService storeCustomerService
    ) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.storeCustomerService = storeCustomerService;
    }

    public List<CategoryDTO> listCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getCategoryId(), c.getCategoryName()))
                .collect(Collectors.toList());
    }

    public Page<ProductCardDTO> listProducts(Integer categoryId, String search, Pageable pageable) {
        String searchTerm = (search == null || search.isBlank()) ? null : search.trim();
        return productRepository.search(categoryId, searchTerm, pageable).map(this::toCard);
    }

    public ProductCardDTO getProduct(Integer id) {
        products p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toCard(p);
    }

    public Page<ReviewDTO> productReviews(Integer productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        return reviewRepository.findByProduct_ProductIdOrderByReviewDateDesc(productId, pageable)
                .map(this::toReviewDto);
    }

    @Transactional
    public ReviewDTO createReview(CreateReviewRequest request) {
        var customer = storeCustomerService.requireCustomer();
        products product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Long purchases = reviewRepository.countPurchases(customer.getCustomerId(), product.getProductId());
        if (purchases == null || purchases == 0) {
            throw new IllegalArgumentException("You can only review products you have purchased");
        }

        reviews review = new reviews();
        review.setCustomer(customer);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setReviewText(request.getComment());
        review.setReviewDate(LocalDate.now());
        return toReviewDto(reviewRepository.save(review));
    }

    private ProductCardDTO toCard(products p) {
        categories cat = p.getCategory();
        Double avg = reviewRepository.avgRatingForProduct(p.getProductId());
        Long count = reviewRepository.countForProduct(p.getProductId());
        return ProductCardDTO.builder()
                .productId(p.getProductId())
                .productName(p.getProductName())
                .price(p.getPrice())
                .stock(p.getStock())
                .categoryId(cat == null ? null : cat.getCategoryId())
                .categoryName(cat == null ? null : cat.getCategoryName())
                .imageUrl(p.getImageUrl())
                .avgRating(avg == null ? 0.0 : avg)
                .reviewCount(count == null ? 0L : count)
                .build();
    }

    private ReviewDTO toReviewDto(reviews r) {
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
    }
}
