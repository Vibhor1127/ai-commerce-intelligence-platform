package com.vibhor.ecommerceanalytics.Exception;


public class AnalyticsDataAccessException extends RuntimeException {


    public AnalyticsDataAccessException(String message) {

        super(message);

    }


    public AnalyticsDataAccessException(
            String message,
            Throwable cause) {

        super(message, cause);

    }

}