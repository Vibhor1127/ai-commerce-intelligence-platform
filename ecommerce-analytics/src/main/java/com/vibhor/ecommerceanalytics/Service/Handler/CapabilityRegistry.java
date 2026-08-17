package com.vibhor.ecommerceanalytics.Service.Handler;


import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

}