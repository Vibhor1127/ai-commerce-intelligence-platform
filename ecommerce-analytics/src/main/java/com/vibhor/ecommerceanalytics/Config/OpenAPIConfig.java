package com.vibhor.ecommerceanalytics.Config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

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
                                        - Self-Describing Capability Registry
                                        - Deterministic SQL Analytics
                                        - Evidence Based AI Explanation

                                        Authentication:
                                        1. Register via POST /auth/register
                                        2. Login via POST /auth/login to get JWT
                                        3. Click 'Authorize' button and enter: Bearer <your-token>
                                        """
                                )
                )
                .addSecurityItem(
                        new SecurityRequirement()
                                .addList("Bearer Authentication")
                )
                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "Bearer Authentication",
                                        new SecurityScheme()
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                                .description("Enter JWT token obtained from /auth/login")
                                )
                );

    }

}