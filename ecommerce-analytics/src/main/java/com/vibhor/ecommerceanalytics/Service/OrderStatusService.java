package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.OrderStatusHistoryDTO;
import com.vibhor.ecommerceanalytics.Entity.*;
import com.vibhor.ecommerceanalytics.Exception.InvalidOrderTransitionException;
import com.vibhor.ecommerceanalytics.Exception.ResourceNotFoundException;
import com.vibhor.ecommerceanalytics.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * State machine for order lifecycle transitions.
 *
 * Allowed transitions:
 *   PENDING    → PROCESSING, CANCELLED
 *   PROCESSING → COMPLETED, CANCELLED
 *   COMPLETED  → REFUNDED
 *   CANCELLED  → (terminal)
 *   REFUNDED   → (terminal)
 *
 * Cancellation and refund automatically restock inventory and log entries
 * in inventory_logs.
 */
@Service
public class OrderStatusService {

    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS;

    static {
        Map<OrderStatus, Set<OrderStatus>> map = new EnumMap<>(OrderStatus.class);
        map.put(OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.CANCELLED));
        map.put(OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED));
        map.put(OrderStatus.PROCESSING, Set.of(OrderStatus.SHIPPED, OrderStatus.COMPLETED, OrderStatus.CANCELLED));
        map.put(OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED, OrderStatus.COMPLETED, OrderStatus.RETURNED, OrderStatus.CANCELLED));
        map.put(OrderStatus.DELIVERED, Set.of(OrderStatus.COMPLETED, OrderStatus.RETURNED, OrderStatus.REFUNDED));
        map.put(OrderStatus.COMPLETED, Set.of(OrderStatus.RETURNED, OrderStatus.REFUNDED));
        map.put(OrderStatus.RETURNED, Set.of(OrderStatus.REFUNDED));
        map.put(OrderStatus.CANCELLED, Set.of());
        map.put(OrderStatus.REFUNDED, Set.of());
        VALID_TRANSITIONS = Collections.unmodifiableMap(map);
    }

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final ProductRepository productRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public OrderStatusService(
            OrderRepository orderRepository,
            OrderStatusHistoryRepository historyRepository,
            ProductRepository productRepository,
            InventoryLogRepository inventoryLogRepository
    ) {
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
        this.productRepository = productRepository;
        this.inventoryLogRepository = inventoryLogRepository;
    }

    /**
     * Validates and executes a status transition, recording audit history
     * and performing inventory restock when applicable.
     *
     * @throws InvalidOrderTransitionException if the transition is illegal
     * @throws ResourceNotFoundException if the order does not exist
     */
    @Transactional
    public orders transition(Integer orderId, OrderStatus newStatus, String changedBy, String note) {
        orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        OrderStatus currentStatus = order.getStatus();

        // Validate the transition
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidOrderTransitionException(
                    "Cannot transition order from " + currentStatus + " to " + newStatus);
        }

        // Record the history entry
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setFromStatus(currentStatus == null ? null : currentStatus.name());
        history.setToStatus(newStatus.name());
        history.setChangedBy(changedBy);
        history.setNote(note);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        // Perform inventory restock for cancellations, refunds, and returns
        if (newStatus == OrderStatus.CANCELLED || newStatus == OrderStatus.REFUNDED || newStatus == OrderStatus.RETURNED) {
            restockInventory(order);
        }

        // Update the order status
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Returns the valid next statuses for a given current status.
     * Used by the admin frontend to populate dropdown options.
     */
    public Set<OrderStatus> validTransitions(OrderStatus currentStatus) {
        if (currentStatus == null) {
            return Set.of(OrderStatus.PENDING);
        }
        return VALID_TRANSITIONS.getOrDefault(currentStatus, Set.of());
    }

    /**
     * Returns the full status history for an order, newest first.
     */
    public List<OrderStatusHistoryDTO> getHistory(Integer orderId) {
        return historyRepository.findByOrder_OrderIdOrderByChangedAtDesc(orderId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == null) return to == OrderStatus.PENDING;
        Set<OrderStatus> allowed = VALID_TRANSITIONS.get(from);
        return allowed != null && allowed.contains(to);
    }

    /**
     * Restocks all items from an order back into product inventory
     * and creates corresponding inventory_log entries.
     */
    private void restockInventory(orders order) {
        if (order.getOrderItems() == null) return;

        for (orderItem item : order.getOrderItems()) {
            products product = productRepository.findById(item.getProduct().getProductId()).orElseThrow();
            int before = product.getStock() == null ? 0 : product.getStock();
            int after = before + item.getQuantity();
            product.setStock(after);
            productRepository.save(product);

            inventoryLogs log = new inventoryLogs();
            log.setProduct(product);
            log.setStockBefore(before);
            log.setStockAfter(after);
            log.setChangeType("STATUS_RESTOCK");
            log.setChangeDate(LocalDateTime.now());
            inventoryLogRepository.save(log);
        }
    }

    private OrderStatusHistoryDTO toDto(OrderStatusHistory h) {
        return OrderStatusHistoryDTO.builder()
                .historyId(h.getHistoryId())
                .orderId(h.getOrder().getOrderId())
                .fromStatus(h.getFromStatus())
                .toStatus(h.getToStatus())
                .changedBy(h.getChangedBy())
                .note(h.getNote())
                .changedAt(h.getChangedAt())
                .build();
    }
}
