package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.ShopDTO;
import com.smartcity.ecommerce.model.*;
import com.smartcity.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopDTO getShopBySeller(String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Shop shop = shopRepository.findBySeller(seller).orElse(null);
        return shop != null ? mapToDTO(shop) : null;
    }

    public ShopDTO createShop(String username, ShopDTO dto) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (shopRepository.findBySeller(seller).isPresent()) {
            throw new RuntimeException("Seller already has a shop");
        }

        Shop shop = Shop.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .image(dto.getImage())
                .seller(seller)
                .build();

        shop = shopRepository.save(shop);
        return mapToDTO(shop);
    }

    public ShopDTO updateShop(String username, ShopDTO dto) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Shop shop = shopRepository.findBySeller(seller)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (dto.getName() != null) shop.setName(dto.getName());
        if (dto.getDescription() != null) shop.setDescription(dto.getDescription());
        if (dto.getImage() != null) shop.setImage(dto.getImage());

        shop = shopRepository.save(shop);
        return mapToDTO(shop);
    }

    public List<ShopDTO> getAllShops() {
        return shopRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ShopDTO getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return mapToDTO(shop);
    }

    private ShopDTO mapToDTO(Shop shop) {
        ShopDTO dto = new ShopDTO();
        dto.setId(shop.getId());
        dto.setName(shop.getName());
        dto.setDescription(shop.getDescription());
        dto.setImage(shop.getImage());
        dto.setSellerId(shop.getSeller().getId());
        dto.setSellerName(shop.getSeller().getFullName());
        return dto;
    }
}
