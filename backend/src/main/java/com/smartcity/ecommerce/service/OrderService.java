package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.*;
import com.smartcity.ecommerce.model.*;
import com.smartcity.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDTO createOrder(String username, String shippingAddress) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customer.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        for (CartItem ci : cartItems) {
            if (ci.getProduct().getStock() < ci.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + ci.getProduct().getName());
            }
        }

        double total = cartItems.stream()
                .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity())
                .sum();

        Order order = Order.builder()
                .customer(customer)
                .totalAmount(total)
                .status("PENDING")
                .paymentStatus("PENDING")
                .shippingAddress(shippingAddress)
                .items(new ArrayList<>())
                .build();

        order = orderRepository.save(order);

        for (CartItem ci : cartItems) {
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(ci.getProduct())
                    .quantity(ci.getQuantity())
                    .price(ci.getProduct().getPrice())
                    .build();
            order.getItems().add(oi);

            Product product = ci.getProduct();
            product.setStock(product.getStock() - ci.getQuantity());
            productRepository.save(product);
        }

        order = orderRepository.save(order);
        cartItemRepository.deleteByCustomerId(customer.getId());

        return mapToDTO(order);
    }

    public List<OrderDTO> getOrdersByCustomer(String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersBySeller(String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findOrdersBySellerId(seller.getId())
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapToDTO(order);
    }

    @Transactional
    public OrderDTO simulatePayment(Long orderId, String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Not authorized");
        }

        order.setPaymentStatus("PAID");
        order.setStatus("CONFIRMED");
        order = orderRepository.save(order);
        return mapToDTO(order);
    }

    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        analytics.setTotalCustomers(userRepository.countByRole(Role.CUSTOMER));
        analytics.setTotalSellers(userRepository.countByRole(Role.SELLER));
        analytics.setTotalProducts(productRepository.count());
        analytics.setTotalOrders(orderRepository.count());
        analytics.setTotalRevenue(orderRepository.getTotalRevenue());
        analytics.setPendingOrders(orderRepository.findAll().stream()
                .filter(o -> "PENDING".equals(o.getStatus())).count());
        analytics.setDeliveredOrders(orderRepository.findAll().stream()
                .filter(o -> "DELIVERED".equals(o.getStatus())).count());
        return analytics;
    }

    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(item -> {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setProductId(item.getProduct().getId());
                itemDTO.setProductName(item.getProduct().getName());
                itemDTO.setProductImage(item.getProduct().getImage());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setPrice(item.getPrice());
                return itemDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
