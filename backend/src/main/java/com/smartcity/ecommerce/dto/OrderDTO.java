package com.smartcity.ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Double totalAmount;
    private String status;
    private String paymentStatus;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}
