package com.smartcity.ecommerce.controller;

import com.smartcity.ecommerce.dto.UserDTO;
import com.smartcity.ecommerce.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserByUsername(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), dto));
    }

    @PostMapping("/me/image")
    public ResponseEntity<UserDTO> uploadProfileImage(@AuthenticationPrincipal UserDetails userDetails,
                                                       @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeFile(file);
        return ResponseEntity.ok(userService.updateProfileImage(userDetails.getUsername(), filename));
    }
}
