package com.smartcity.ecommerce.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String image;
    private Long shopId;
    private String shopName;
}
