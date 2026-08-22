package com.vibhor.ecommerceanalytics.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AiSecurityException extends RuntimeException {
    public AiSecurityException(String message) {
        super(message);
    }
}
