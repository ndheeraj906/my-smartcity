package com.smartcity.ecommerce.dto;

import lombok.Data;

@Data
public class AnalyticsDTO {
    private long totalCustomers;
    private long totalSellers;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private long pendingOrders;
    private long deliveredOrders;
}
