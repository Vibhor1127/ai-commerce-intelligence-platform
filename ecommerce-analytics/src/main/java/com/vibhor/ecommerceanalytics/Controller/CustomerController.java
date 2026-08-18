package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.CustomerRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.CustomerResponseDTO;
import com.vibhor.ecommerceanalytics.DTO.ErrorResponse;
import com.vibhor.ecommerceanalytics.DTO.ValidationErrorResponse;
import com.vibhor.ecommerceanalytics.Service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Customer CRUD management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get all customers", description = "Returns a complete list of all registered store customers.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved customer list",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = CustomerResponseDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required")
    })
    public List<CustomerResponseDTO> getallCustomer() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Retrieves details for a specific customer by primary key.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer details found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CustomerResponseDTO.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<CustomerResponseDTO> getCustomerbyId(
            @Parameter(description = "Customer ID", example = "1") @PathVariable Integer id) {
        Optional<CustomerResponseDTO> customer = customerService.getCustomerbyId(id);

        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Add a new customer", description = "Creates a new customer profile in the database.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Customer created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CustomerResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failure on input fields",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required")
    })
    public ResponseEntity<CustomerResponseDTO> addCustomer(
            @Valid @RequestBody CustomerRequestDTO dto) {
        CustomerResponseDTO created = customerService.addCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer details", description = "Updates profile fields for an existing customer.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CustomerResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failure on input fields",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<CustomerResponseDTO> UpdateCustomer(
            @Parameter(description = "Customer ID", example = "1") @PathVariable Integer id,
            @Valid @RequestBody CustomerRequestDTO dto) {
        CustomerResponseDTO update = customerService.UpdateCustomer(id, dto);
        return ResponseEntity.ok(update);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer", description = "Removes a customer record from the system by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Customer deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - JWT required"),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<Void> DeleteCustomer(
            @Parameter(description = "Customer ID", example = "1") @PathVariable Integer id) {
        customerService.DeleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
