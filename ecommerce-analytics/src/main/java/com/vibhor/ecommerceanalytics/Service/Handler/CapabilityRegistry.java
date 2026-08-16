package com.vibhor.ecommerceanalytics.Service.Handler;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Spring injects every AnalyticsCapability bean here automatically --
 * this is what makes new capabilities "plug in" instead of requiring
 * you to edit a switch statement (IntentRouterService) and an if-chain
 * (AIAnalyticsValidatorService, AIAnalyticsExecutorService) every time.
 *
 * To add Shipment analytics tomorrow: write ShipmentAnalyticsHandler
 * implements AnalyticsCapability, annotate it @Component, done.
 * This class never changes.
 */
@Component
public class CapabilityRegistry {

    private final Map<String, AnalyticsCapability> capabilitiesByEntity;

    public CapabilityRegistry(List<AnalyticsCapability> capabilities) {
        this.capabilitiesByEntity = capabilities.stream()
                .collect(Collectors.toMap(
                        c -> c.supportedEntity().toUpperCase(),
                        c -> c
                ));
    }

    public Optional<AnalyticsCapability> resolve(String entity) {
        if (entity == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(capabilitiesByEntity.get(entity.toUpperCase()));
    }

    /**
     * Used for the "I can't answer that yet, but here's what I can do"
     * fallback response instead of a hard error.
     */
    public List<String> supportedEntities() {
        return List.copyOf(capabilitiesByEntity.keySet());
    }
}
