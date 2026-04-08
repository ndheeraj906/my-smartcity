package com.smartcity.ecommerce.controller;

import com.smartcity.ecommerce.dto.ShopDTO;
import com.smartcity.ecommerce.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;
    private final FileStorageService fileStorageService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ShopDTO> getMyShop(@AuthenticationPrincipal UserDetails userDetails) {
        ShopDTO shop = shopService.getShopBySeller(userDetails.getUsername());
        return ResponseEntity.ok(shop);
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ShopDTO> createShop(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody ShopDTO dto) {
        return ResponseEntity.ok(shopService.createShop(userDetails.getUsername(), dto));
    }

    @PutMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ShopDTO> updateShop(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody ShopDTO dto) {
        return ResponseEntity.ok(shopService.updateShop(userDetails.getUsername(), dto));
    }

    @PostMapping("/image")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ShopDTO> uploadShopImage(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeFile(file);
        ShopDTO dto = new ShopDTO();
        dto.setImage(filename);
        return ResponseEntity.ok(shopService.updateShop(userDetails.getUsername(), dto));
    }

    @GetMapping
    public ResponseEntity<List<ShopDTO>> getAllShops() {
        return ResponseEntity.ok(shopService.getAllShops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopDTO> getShop(@PathVariable Long id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }
}
