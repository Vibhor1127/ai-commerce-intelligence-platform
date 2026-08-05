package com.vibhor.ecommerceanalytics.Exception;

import com.vibhor.ecommerceanalytics.DTO.ErrorResponse;
import com.vibhor.ecommerceanalytics.DTO.ValidationErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice

public class GlobalExceptionHandler {


        @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorResponse> HandleCustomerNotFound(CustomerNotFoundException ex)
        {
           //return  ResponseEntity.notFound().build(); // this will just return the error code not Other info
         ErrorResponse er = new ErrorResponse(LocalDateTime.now(),HttpStatus.NOT_FOUND.value(), ex.getMessage());

          return   ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
        }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        ValidationErrorResponse response = new ValidationErrorResponse();

        response.setTimestamp(LocalDateTime.now());
        response.setStatus(HttpStatus.BAD_REQUEST.value());

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        response.setErrors(errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
