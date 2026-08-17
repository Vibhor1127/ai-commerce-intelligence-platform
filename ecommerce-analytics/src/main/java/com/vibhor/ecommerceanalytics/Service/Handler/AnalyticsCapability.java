package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;

/**
 * Contract every business-domain handler implements.
 *
 * This replaces AIAnalyticsValidatorService's if-chain and
 * AIAnalyticsExecutorService's if-chain. Instead of one giant service
 * that knows about every dimension/operation combination, each domain
 * owns its own validation + execution.
 *
 * Adding a new domain (Shipment, Review, Payment) means adding a new
 * @Component that implements this interface -- nothing else changes.
 */
public interface AnalyticsCapability {

    /**
     * The business entity this handler owns, e.g. "CUSTOMER", "PRODUCT".
     * Must match one of the entity values your LLM prompt is allowed to output.
     * This is the ONLY string the CapabilityRegistry needs to route correctly --
     * everything else (metric, operation, filters) is interpreted inside the handler.
     */
    String supportedEntity();

    /**
     * Checks whether this capability
     * can handle this specific intent.
     *
     * Example:
     *
     * CUSTOMER + RANK_TOP  -> true
     *
     * CUSTOMER + CHURN_RISK -> true
     *
     * CUSTOMER + SENTIMENT -> false
     */
    boolean supports(AnalyticsIntent intent);

    /**
     * Business-level validation for this domain (permissions, supported
     * operations, required fields). Structural validation (is entity present,
     * is confidence present) already happened before this is called.
     */
    ValidationResult validate(AnalyticsIntent intent);

    /**
     * Run the actual analytics for this domain and return data ready for
     * the AI Explanation layer. Implementations should call existing
     * BusinessAnalyticsService methods -- this class is a router/wrapper,
     * not a place to write new SQL access.
     */
    Object execute(AnalyticsIntent intent);
}
