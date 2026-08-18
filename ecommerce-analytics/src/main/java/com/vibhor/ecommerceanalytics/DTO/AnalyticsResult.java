package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

/**
 * Typed wrapper returned by every AnalyticsCapability.execute().
 *
 * Replaces the raw Object return, giving the AI Explanation layer
 * structured metadata about what it is explaining.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResult {

    /** Which business entity was queried, e.g. "CUSTOMER" */
    private String entity;

    /** Which operation was executed, e.g. "TOP_CUSTOMERS" */
    private String operation;

    /** The actual query result data (list of DTOs, etc.) */
    private Object data;

    /** Human-readable description for the AI explanation prompt */
    private String dataDescription;

    /** Number of records returned */
    private int recordCount;
}
