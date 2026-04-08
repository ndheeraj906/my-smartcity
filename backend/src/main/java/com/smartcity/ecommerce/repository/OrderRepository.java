package com.smartcity.ecommerce.repository;

import com.smartcity.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi WHERE oi.product.shop.seller.id = :sellerId ORDER BY o.createdAt DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Double getTotalRevenue();

    List<Order> findAllByOrderByCreatedAtDesc();
}
