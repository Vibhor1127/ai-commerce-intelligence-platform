package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.categories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<categories, Integer> {
}
