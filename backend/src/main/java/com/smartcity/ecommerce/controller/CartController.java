package com.smartcity.ecommerce.controller;

import com.smartcity.ecommerce.dto.CartItemDTO;
import com.smartcity.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartItems(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return ResponseEntity.ok(cartService.addToCart(userDetails.getUsername(), productId, quantity));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long itemId,
                                                       @AuthenticationPrincipal UserDetails userDetails,
                                                       @RequestBody Map<String, Integer> request) {
        return ResponseEntity.ok(cartService.updateCartItem(itemId, userDetails.getUsername(), request.get("quantity")));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        cartService.removeFromCart(itemId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
