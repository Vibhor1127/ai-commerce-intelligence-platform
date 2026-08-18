package com.vibhor.ecommerceanalytics.Service.Handler;


import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;


@Component
public class CapabilityRegistry {


    private final Map<String, List<AnalyticsCapability>> capabilities;



    public CapabilityRegistry(
            List<AnalyticsCapability> capabilityList
    ){


        this.capabilities =
                capabilityList
                        .stream()
                        .collect(
                                Collectors.groupingBy(
                                        c -> c.supportedEntity()
                                                .toUpperCase()
                                )
                        );

    }




    public Optional<AnalyticsCapability> resolve(
            AnalyticsIntent intent
    ){


        if(intent.getEntity()==null){
            return Optional.empty();
        }



        List<AnalyticsCapability> handlers =
                capabilities.get(
                        intent.getEntity()
                                .toUpperCase()
                );



        if(handlers==null){
            return Optional.empty();
        }



        return handlers
                .stream()
                .filter(
                        h -> h.supports(intent)
                )
                .findFirst();

    }




    public List<String> supportedEntities(){

        return List.copyOf(
                capabilities.keySet()
        );

    }


    /**
     * Generates a capability manifest as a list of maps.
     * Used by AIAnalyticsService to dynamically inject into LLM prompt.
     *
     * Output format:
     * [
     *   {
     *     "entity": "CUSTOMER",
     *     "description": "Analyzes customer behavior...",
     *     "operations": ["TOP_CUSTOMERS", "LIFETIME_VALUE", ...]
     *   },
     *   ...
     * ]
     */
    public List<Map<String, Object>> generateCapabilityManifest() {

        return capabilities.values().stream()
                .flatMap(List::stream)
                .map(c -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("entity", c.supportedEntity());
                    entry.put("description", c.description());
                    entry.put("operations", c.supportedOperations());
                    return entry;
                })
                .collect(Collectors.toList());
    }


    /**
     * Generates the entity list for the LLM prompt.
     * Example output: "CUSTOMER, PRODUCT, REVENUE, INVENTORY, PAYMENT, ..."
     */
    public String generatePromptEntityList() {

        return capabilities.keySet().stream()
                .sorted()
                .collect(Collectors.joining(", "));
    }


    /**
     * Generates a formatted operations reference for the LLM prompt.
     * Lists each entity with its available operations.
     */
    public String generatePromptOperationsReference() {

        StringBuilder sb = new StringBuilder();

        capabilities.values().stream()
                .flatMap(List::stream)
                .forEach(c -> {
                    sb.append("\n").append(c.supportedEntity()).append(":\n");
                    sb.append("  Description: ").append(c.description()).append("\n");
                    sb.append("  Operations: ").append(
                            String.join(", ", c.supportedOperations())
                    ).append("\n");
                });

        return sb.toString();
    }

}