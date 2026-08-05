package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;
import com.vibhor.ecommerceanalytics.Repository.BusinessAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessAnalyticsService {
    @Autowired
                private BusinessAnalyticsRepository businessAnalyticsRepository;
                public List<TopCustomerDTO> getTopCustomers() {
            return    businessAnalyticsRepository.getTopcustomers();
                }
}
