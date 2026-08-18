package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;

import java.util.List;

/**
 * Contract every business-domain handler implements.
 *
 * SELF-DESCRIBING CAPABILITY PATTERN:
 *
 * Each handler declares what it can do via description() and
 * supportedOperations(). The CapabilityRegistry reads these at
 * startup and generates a capability manifest that is injected
 * into the LLM prompt. This means:
 *
 * - Adding a new @Component handler automatically teaches the LLM
 * - No hardcoded entity lists in the prompt
 * - No manual prompt editing when domains are added
 *
 * Adding a new domain (Shipment, Review, Payment) means adding a new
 * @Component that implements this interface -- nothing else changes.
 */
public interface AnalyticsCapability {

    /**
     * The business entity this handler owns, e.g. "CUSTOMER", "PRODUCT".
     * Must match one of the entity values the LLM will output.
     * The CapabilityRegistry uses this for primary routing.
     */
    String supportedEntity();

    /**
     * Human-readable description of what this capability analyzes.
     * This is injected into the LLM prompt so the AI understands
     * when to route questions to this handler.
     *
     * Example:
     * "Analyzes payment transactions including failed payments,
     *  payment method performance, and payment success rates"
     */
    String description();

    /**
     * Exact operation names this handler supports.
     * These are injected into the LLM prompt as valid operation values.
     * The LLM must pick from this list, eliminating keyword fragility.
     *
     * Example: List.of("TOP_CUSTOMERS", "LIFETIME_VALUE", "INACTIVE_CUSTOMERS")
     */
    List<String> supportedOperations();

    /**
     * Checks whether this capability can handle this specific intent.
     * Uses exact operation matching against supportedOperations().
     */
    default boolean supports(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "" : intent.getOperation().toUpperCase();
        return supportedOperations().contains(operation);
    }

    /**
     * Business-level validation for this domain (permissions, supported
     * operations, required fields). Structural validation (is entity present,
     * is confidence present) already happened before this is called.
     */
    ValidationResult validate(AnalyticsIntent intent);

    /**
     * Run the actual analytics for this domain and return a typed
     * AnalyticsResult containing data + metadata for the AI
     * Explanation layer.
     */
    AnalyticsResult execute(AnalyticsIntent intent);
}

