package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Repository.ReviewAnalyticsRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReviewAnalyticsHandler implements AnalyticsCapability {

    private final ReviewAnalyticsRepository reviewAnalyticsRepository;

    public ReviewAnalyticsHandler(ReviewAnalyticsRepository reviewAnalyticsRepository) {
        this.reviewAnalyticsRepository = reviewAnalyticsRepository;
    }

    @Override
    public String supportedEntity() {
        return "REVIEW";
    }

    @Override
    public String description() {
        return "Analyzes customer feedback, negative reviews, product ratings, and customer satisfaction sentiment";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "NEGATIVE_REVIEWS",
                "PRODUCT_RATINGS",
                "RATING_SUMMARY"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "NEGATIVE_REVIEWS" : intent.getOperation().toUpperCase();

        if (operation.contains("RATING") || operation.contains("SUMMARY") || operation.contains("SCORE")) {
            var data = reviewAnalyticsRepository.getProductRatings();
            return AnalyticsResult.builder()
                    .entity("REVIEW")
                    .operation("PRODUCT_RATINGS")
                    .data(data)
                    .dataDescription("Product rating summary with average scores and total reviews")
                    .recordCount(data.size())
                    .build();
        }

        // Default: negative reviews
        var data = reviewAnalyticsRepository.getNegativeReviews();
        return AnalyticsResult.builder()
                .entity("REVIEW")
                .operation("NEGATIVE_REVIEWS")
                .data(data)
                .dataDescription("Customer reviews with ratings <= 2 and feedback text")
                .recordCount(data.size())
                .build();
    }
}
