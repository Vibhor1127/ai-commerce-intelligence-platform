package com.vibhor.ecommerceanalytics.Exception;


import com.vibhor.ecommerceanalytics.DTO.ErrorResponse;
import com.vibhor.ecommerceanalytics.DTO.ValidationErrorResponse;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;



@RestControllerAdvice
public class GlobalExceptionHandler {


    private static final Logger logger =
            LoggerFactory.getLogger(
                    GlobalExceptionHandler.class
            );



    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorResponse>
    handleCustomerNotFound(
            CustomerNotFoundException ex
    ){

        logger.warn(
                "Customer not found: {}",
                ex.getMessage()
        );


        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        404,
                        ex.getMessage()
                );


        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);

    }





    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse>
    handleValidationException(
            MethodArgumentNotValidException ex
    ){


        logger.warn(
                "Validation failed: {}",
                ex.getMessage()
        );


        ValidationErrorResponse response =
                new ValidationErrorResponse();


        response.setTimestamp(
                LocalDateTime.now()
        );


        response.setStatus(
                400
        );


        Map<String,String> errors =
                new HashMap<>();


        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        response.setErrors(errors);


        return ResponseEntity
                .badRequest()
                .body(response);

    }





    @ExceptionHandler(
            UnsupportedCapabilityException.class
    )
    public ResponseEntity<ErrorResponse>
    handleUnsupportedCapability(
            UnsupportedCapabilityException ex
    ){


        logger.warn(
                "Unsupported capability: {}",
                ex.getMessage()
        );


        return ResponseEntity
                .badRequest()
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                400,
                                ex.getMessage()
                        )
                );

    }





    @ExceptionHandler(
            InvalidAIResponseException.class
    )
    public ResponseEntity<ErrorResponse>
    handleInvalidAIResponse(
            InvalidAIResponseException ex
    ){


        logger.error(
                "Invalid AI response: {}",
                ex.getMessage()
        );


        return ResponseEntity
                .status(422)
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                422,
                                "Unable to process AI response"
                        )
                );

    }





    @ExceptionHandler(
            AnalyticsDataAccessException.class
    )
    public ResponseEntity<ErrorResponse>
    handleAnalyticsDataAccess(
            AnalyticsDataAccessException ex
    ){


        logger.error(
                "Analytics database error: {}",
                ex.getMessage()
        );


        return ResponseEntity
                .status(500)
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                500,
                                "Analytics processing failed"
                        )
                );

    }





    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse>
    handleDatabaseException(
            DataAccessException ex
    ){


        logger.error(
                "Database exception",
                ex
        );


        return ResponseEntity
                .status(500)
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                500,
                                "Database operation failed"
                        )
                );

    }





    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse>
    handleGlobalException(
            Exception ex
    ){


        logger.error(
                "Unexpected application exception",
                ex
        );


        return ResponseEntity
                .status(500)
                .body(
                        new ErrorResponse(
                                LocalDateTime.now(),
                                500,
                                "Something went wrong. Please try again later."
                        )
                );

    }

}