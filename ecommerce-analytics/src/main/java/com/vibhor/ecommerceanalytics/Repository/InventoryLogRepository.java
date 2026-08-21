package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.inventoryLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface InventoryLogRepository extends JpaRepository<inventoryLogs, Integer> {

    @Query(value = """
        SELECT MAX(change_date) FROM inventory_logs WHERE product_id = :productId
        """, nativeQuery = true)
    Optional<LocalDateTime> findLastChangeDate(@Param("productId") Integer productId);
}
