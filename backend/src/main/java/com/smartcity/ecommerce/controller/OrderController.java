package com.smartcity.ecommerce.controller;

import com.smartcity.ecommerce.dto.OrderDTO;
import com.smartcity.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDTO> createOrder(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.createOrder(userDetails.getUsername(), request.get("shippingAddress")));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(userDetails.getUsername()));
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<OrderDTO>> getSellerOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrdersBySeller(userDetails.getUsername()));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDTO> simulatePayment(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.simulatePayment(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id,
                                                       @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.get("status")));
    }
}
