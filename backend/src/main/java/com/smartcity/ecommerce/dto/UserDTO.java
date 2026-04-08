package com.smartcity.ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String profileImage;
    private String role;
    private boolean blocked;
    private LocalDateTime createdAt;
}
