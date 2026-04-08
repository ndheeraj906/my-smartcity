package com.smartcity.ecommerce.dto;

import lombok.Data;

@Data
public class ShopDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Long sellerId;
    private String sellerName;
}
