package com.vibhor.ecommerceanalytics.Config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class OpenAPIConfig {


    @Bean
    public OpenAPI customOpenAPI() {


        return new OpenAPI()
                .info(
                        new Info()
                                .title(
                                        "AI Commerce Intelligence Platform API"
                                )
                                .version("1.0")
                                .description(
                                        """
                                        AI powered E-Commerce Business Intelligence Platform.
    
                                        Architecture:
                                        - LLM Intent Classification
                                        - Capability Registry Pattern
                                        - Deterministic SQL Analytics
                                        - Evidence Based AI Explanation
                                        """
                                )
                );

    }

}