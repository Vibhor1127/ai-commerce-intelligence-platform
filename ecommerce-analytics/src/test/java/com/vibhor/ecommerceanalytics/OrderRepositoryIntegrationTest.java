package com.vibhor.ecommerceanalytics;

import com.vibhor.ecommerceanalytics.DTO.OrderDTO;
import com.vibhor.ecommerceanalytics.Entity.OrderStatus;
import com.vibhor.ecommerceanalytics.Entity.orders;
import com.vibhor.ecommerceanalytics.Repository.OrderRepository;
import com.vibhor.ecommerceanalytics.Service.OrderMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class OrderRepositoryIntegrationTest {

    @Autowired
    private OrderRepository orderRepository;

    @Test
    @DisplayName("Verify OrderRepository finds all orders without HQL casting syntax error")
    void testFindAllOrders() {
        Page<orders> orders = orderRepository.findAllByOrderByOrderDateDesc(PageRequest.of(0, 10));
        assertThat(orders).isNotNull();
    }

    @Test
    @DisplayName("Verify OrderRepository status filter query works correctly")
    void testFindByStatus() {
        Page<orders> orders = orderRepository.findByStatusOrderByOrderDateDesc(OrderStatus.PROCESSING, PageRequest.of(0, 10));
        assertThat(orders).isNotNull();
    }

    @Test
    @DisplayName("Verify OrderRepository customer search query executes cleanly")
    void testSearchByCustomerName() {
        Page<orders> orders = orderRepository.searchByCustomerName("Vibhor", PageRequest.of(0, 10));
        assertThat(orders).isNotNull();
    }

    @Test
    @DisplayName("Verify OrderMapper safely maps orders with null associations without throwing NPE")
    void testOrderMapperDefensive() {
        orders o = new orders();
        o.setOrderId(999);
        o.setStatus(OrderStatus.PENDING);
        o.setTotalAmount(1500.0);

        OrderDTO dto = OrderMapper.toDto(o);
        assertThat(dto).isNotNull();
        assertThat(dto.getOrderId()).isEqualTo(999);
        assertThat(dto.getStatus()).isEqualTo("PENDING");
        assertThat(dto.getItems()).isEmpty();
        assertThat(dto.getShippingAddress()).isNull();
    }

    @Test
    @DisplayName("Verify Indian 10-digit phone and 6-digit pincode regex rules")
    void testPhoneAndPincodeValidationRegex() {
        String phoneRegex = "^[6-9]\\d{9}$";
        String pincodeRegex = "^\\d{6}$";

        // Valid phone numbers
        assertThat("9876543210".matches(phoneRegex)).isTrue();
        assertThat("8960136926".matches(phoneRegex)).isTrue();
        assertThat("7001234567".matches(phoneRegex)).isTrue();
        assertThat("6234567890".matches(phoneRegex)).isTrue();

        // Invalid phone numbers
        assertThat("5876543210".matches(phoneRegex)).isFalse();
        assertThat("987654321".matches(phoneRegex)).isFalse();
        assertThat("98765432100".matches(phoneRegex)).isFalse();
        assertThat("98765abcd0".matches(phoneRegex)).isFalse();

        // Valid pincodes
        assertThat("226024".matches(pincodeRegex)).isTrue();
        assertThat("560001".matches(pincodeRegex)).isTrue();

        // Invalid pincodes
        assertThat("22602".matches(pincodeRegex)).isFalse();
        assertThat("2260240".matches(pincodeRegex)).isFalse();
        assertThat("22602a".matches(pincodeRegex)).isFalse();
    }
}