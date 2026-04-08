package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.ProductDTO;
import com.smartcity.ecommerce.model.*;
import com.smartcity.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public Page<ProductDTO> getProducts(String search, String category, Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepository.findByFilters(search, category, minPrice, maxPrice, pageable)
                .map(this::mapToDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    public List<ProductDTO> getProductsByShop(Long shopId) {
        return productRepository.findByShopId(shopId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    public ProductDTO createProduct(String username, ProductDTO dto) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Shop shop = shopRepository.findBySeller(seller)
                .orElseThrow(() -> new RuntimeException("Create a shop first"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(dto.getCategory())
                .image(dto.getImage())
                .shop(shop)
                .build();

        product = productRepository.save(product);
        return mapToDTO(product);
    }

    public ProductDTO updateProduct(Long id, String username, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!product.getShop().getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("Not authorized to update this product");
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getImage() != null) product.setImage(dto.getImage());

        product = productRepository.save(product);
        return mapToDTO(product);
    }

    public void deleteProduct(Long id, String username) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!product.getShop().getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("Not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    public void adminDeleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setCategory(product.getCategory());
        dto.setImage(product.getImage());
        dto.setShopId(product.getShop().getId());
        dto.setShopName(product.getShop().getName());
        return dto;
    }
}
