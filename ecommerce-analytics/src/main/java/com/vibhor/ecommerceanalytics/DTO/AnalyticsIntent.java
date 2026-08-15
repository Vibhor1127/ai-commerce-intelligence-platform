package com.vibhor.ecommerceanalytics.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsIntent {


    /*
     * Main business capability
     *
     * Examples:
     * TOP_CUSTOMERS
     * TOP_PRODUCTS
     * REVENUE_TREND
     * INACTIVE_CUSTOMERS
     */
    private String intent;



    /*
     * Business entity involved
     *
     * Examples:
     * CUSTOMER
     * PRODUCT
     * CATEGORY
     * INVENTORY
     */
    private String entity;



    /*
     * Business metric
     *
     * Examples:
     * TOTAL_SPENDING
     * REVENUE
     * SALES
     * STOCK_LEVEL
     */
    private String metric;



    /*
     * Operation required
     *
     * Examples:
     * RANK
     * TREND
     * SUMMARY
     * ALERT
     */
    private String operation;



    /*
     * Number of records required
     *
     * Example:
     * Top 10 customers
     */
    private Integer limit;



    /*
     * AI confidence score
     *
     * Example:
     * 0.95 = highly confident
     * 0.40 = uncertain
     */
    private Double confidence;


}