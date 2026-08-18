package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.AuthResponseDTO;
import com.vibhor.ecommerceanalytics.DTO.ErrorResponse;
import com.vibhor.ecommerceanalytics.DTO.LoginRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.RegisterRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.ValidationErrorResponse;
import com.vibhor.ecommerceanalytics.Service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User registration and JWT token generation endpoints")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    // Register user
    @PostMapping("/register")
    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account with encrypted password and specified role (USER, ADMIN, ANALYST)."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully",
                    content = @Content(
                            mediaType = "text/plain",
                            examples = @ExampleObject(value = "User registered successfully")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failure on input fields",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class),
                            examples = @ExampleObject(
                                    value = "{\"timestamp\":\"2026-08-18T22:30:00\",\"status\":400,\"errors\":{\"username\":\"Username must be between 3 and 50 characters\",\"password\":\"Password must be at least 6 characters\"}}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Username already exists in the system",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = "{\"timestamp\":\"2026-08-18T22:30:00\",\"status\":409,\"message\":\"Username 'analytics_admin' is already registered\"}"
                            )
                    )
            )
    })
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequestDTO dto) {

        String result = authenticationService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // Login user and receive JWT
    @PostMapping("/login")
    @Operation(
            summary = "Authenticate user & obtain JWT token",
            description = "Validates user credentials against the database and returns a signed Bearer JWT token for subsequent API requests."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully authenticated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponseDTO.class),
                            examples = @ExampleObject(
                                    value = "{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYy..."
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request payload format",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid username or password",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = "{\"timestamp\":\"2026-08-18T22:30:00\",\"status\":401,\"message\":\"Invalid username or password\"}"
                            )
                    )
            )
    })
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto) {

        return ResponseEntity.ok(authenticationService.login(dto));
    }
}