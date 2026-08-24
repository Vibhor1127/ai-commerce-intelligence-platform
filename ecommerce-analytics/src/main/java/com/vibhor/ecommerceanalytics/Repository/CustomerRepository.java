package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<customers, Integer> {
    Optional<customers> findByUserId(Integer userId);

    Optional<customers> findByEmail(String email);

    @Query("""
        SELECT c FROM customers c
        WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%'))
        """)
    List<customers> searchCustomers(@Param("query") String query);
}
