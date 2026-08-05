package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {
    @Autowired
        private BusinessAnalyticsService businessAnalyticsService;
        @GetMapping("/top-customers")
    public List<TopCustomerDTO> GetTopCustomers()
        {
            return  businessAnalyticsService.getTopCustomers();
        }
            @GetMapping("/top-products")
                    public List<TopProductDTO> GetTopProducts()
            {
                return
            }
}
