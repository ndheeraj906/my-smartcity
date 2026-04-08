package com.smartcity.ecommerce.controller;

import com.smartcity.ecommerce.dto.ProductDTO;
import com.smartcity.ecommerce.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.getProducts(search, category, minPrice, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<ProductDTO>> getProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDTO> createProduct(@AuthenticationPrincipal UserDetails userDetails,
                                                     @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(userDetails.getUsername(), dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserDetails userDetails,
                                                     @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, userDetails.getUsername(), dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        productService.deleteProduct(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDTO> uploadProductImage(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestParam("file") MultipartFile file) {
        String filename = fileStorageService.storeFile(file);
        ProductDTO dto = new ProductDTO();
        dto.setImage(filename);
        return ResponseEntity.ok(productService.updateProduct(id, userDetails.getUsername(), dto));
    }
}
