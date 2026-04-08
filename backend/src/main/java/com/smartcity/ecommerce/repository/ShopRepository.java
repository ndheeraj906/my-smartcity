package com.smartcity.ecommerce.repository;

import com.smartcity.ecommerce.model.Shop;
import com.smartcity.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findBySeller(User seller);
    Optional<Shop> findBySellerId(Long sellerId);
}
