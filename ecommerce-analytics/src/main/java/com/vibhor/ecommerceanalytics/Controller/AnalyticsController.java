package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Business Analytics", description = "Deterministic SQL-driven e-commerce business analytics & metrics endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalyticsController {

    @Autowired
    private BusinessAnalyticsService businessAnalyticsService;

    // ============================================================
    // TOP CUSTOMERS
    // ============================================================
    @GetMapping("/top-customers")
    @Operation(
            summary = "Get top customers by spending",
            description = "Fetches the highest-spending customers ranked in descending order. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of top spending customers",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = TopCustomerDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<TopCustomerDTO> GetTopCustomers() {
        return businessAnalyticsService.getTopCustomers();
    }

    // ============================================================
    // TOP PRODUCTS
    // ============================================================
    @GetMapping("/top-products")
    @Operation(
            summary = "Get top performing products",
            description = "Fetches top products by sales volume and generated revenue. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of top performing products",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = TopProductsDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<TopProductsDTO> GetTopProducts() {
        return businessAnalyticsService.getTopProducts();
    }

    // ============================================================
    // MONTHLY REVENUE
    // ============================================================
    @GetMapping("/monthly-revenue")
    @Operation(
            summary = "Get monthly revenue trend",
            description = "Aggregates revenue totals grouped by year and month. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Monthly revenue breakdown",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = MonthlyRevenueDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<MonthlyRevenueDTO> GetMonthlyRevenue() {
        return businessAnalyticsService.getMonthlyRevenue();
    }

    // ============================================================
    // CATEGORY REVENUE
    // ============================================================
    @GetMapping("/category-revenue")
    @Operation(
            summary = "Get revenue breakdown by product category",
            description = "Calculates total revenue contribution per product category. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Category-wise revenue distribution",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = CategoryRevenueDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<CategoryRevenueDTO> GetCategoryRevenue() {
        return businessAnalyticsService.getCategoryRevenue();
    }

    // ============================================================
    // CUSTOMER LIFETIME VALUE
    // ============================================================
    @GetMapping("/customer-lifetime-value")
    @Operation(
            summary = "Get customer lifetime value (CLV)",
            description = "Calculates total lifetime value for each customer based on historical purchases. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of customers ranked by lifetime value",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = CustomerLifetimeValueDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<CustomerLifetimeValueDTO> GetCustomerLifetimeValue() {
        return businessAnalyticsService.getCustomerLifetimeValue();
    }

    // ============================================================
    // INACTIVE CUSTOMERS
    // ============================================================
    @GetMapping("/inactive-customers")
    @Operation(
            summary = "Get inactive / churning customers",
            description = "Identifies customers who have not placed an order in the last 90 days. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of inactive customers and their last order date",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = InactiveCustomerDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<InactiveCustomerDTO> GetInactiveCustomers() {
        return businessAnalyticsService.getInactiveCustomers();
    }

    // ============================================================
    // INVENTORY ALERTS
    // ============================================================
    @GetMapping("/inventory-alerts")
    @Operation(
            summary = "Get low stock inventory alerts",
            description = "Identifies products with current stock level of 10 units or lower. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of products requiring inventory replenishment",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = InventoryAlertDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public List<InventoryAlertDTO> GetInventoryAlerts() {
        return businessAnalyticsService.getInventoryAlerts();
    }

    // ============================================================
    // DASHBOARD
    // ============================================================
    @GetMapping("/dashboard")
    @Operation(
            summary = "Get overarching business dashboard summary",
            description = "Returns key macro business metrics: total revenue, total orders, total customers, and total products. Cached via Redis."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "High-level macro dashboard statistics",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DashboardDTO.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(responseCode = "500", description = "Database or analytics error")
    })
    public DashboardDTO GetDashboard() {
        return businessAnalyticsService.getDashboard();
    }

    @GetMapping("/orders/recent")
    @Operation(summary = "Get most recent orders", description = "Returns the latest orders ordered by date descending.")
    public List<RecentOrderDTO> getRecentOrders(@RequestParam(defaultValue = "15") int limit) {
        return businessAnalyticsService.getRecentOrders(limit);
    }
}