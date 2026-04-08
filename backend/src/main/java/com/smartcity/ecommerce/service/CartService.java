package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.CartItemDTO;
import com.smartcity.ecommerce.model.*;
import com.smartcity.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<CartItemDTO> getCartItems(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartItemRepository.findByCustomerId(user.getId()).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    public CartItemDTO addToCart(String username, Long productId, Integer quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        var existing = cartItemRepository.findByCustomerIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return mapToDTO(cartItemRepository.save(item));
        }

        CartItem item = CartItem.builder()
                .customer(user)
                .product(product)
                .quantity(quantity)
                .build();

        return mapToDTO(cartItemRepository.save(item));
    }

    public CartItemDTO updateCartItem(Long itemId, String username, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!item.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        item.setQuantity(quantity);
        return mapToDTO(cartItemRepository.save(item));
    }

    public void removeFromCart(Long itemId, String username) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!item.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartItemRepository.deleteByCustomerId(user.getId());
    }

    private CartItemDTO mapToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImage());
        dto.setProductPrice(item.getProduct().getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setAvailableStock(item.getProduct().getStock());
        return dto;
    }
}
