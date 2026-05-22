package com.mikan.restapi.service;

import com.mikan.restapi.entity.CartItem;
import com.mikan.restapi.entity.ShoppingSession;
import com.mikan.restapi.model.GlobalException;
import com.mikan.restapi.model.cart.request.AddCartItemRequest;
import com.mikan.restapi.model.cart.request.DeleteCartItemsRequest;
import com.mikan.restapi.model.cart.request.UpdateCartItemRequest;
import com.mikan.restapi.model.cart.response.*;
import com.mikan.restapi.repository.CartItemRepository;
import com.mikan.restapi.repository.ShoppingSessionRepository;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ShoppingSessionRepository shoppingSessionRepository;

    public CartService(CartItemRepository cartItemRepository, ShoppingSessionRepository shoppingSessionRepository) {
        this.cartItemRepository = cartItemRepository;
        this.shoppingSessionRepository = shoppingSessionRepository;
    }

    public AddCartItemResponse addCartItem(String uid, AddCartItemRequest request){
        UUID userId =UUID.fromString(uid);
        // 1. หา session
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    ShoppingSession s = new ShoppingSession();
                    s.setUserId(userId);
                    s.setStatus("ACTIVE");
                    return shoppingSessionRepository.save(s);
                });

        // 2. หา cart item
        CartItem item = cartItemRepository
                .findBySessionIdAndProductIdAndProductOptionId(
                        session.getId(),
                        request.getProductId(),
                        request.getProductOptionId()
                )
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return existing;
                })
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setSessionId(session.getId());
                    ci.setProductId(request.getProductId());
                    ci.setProductOptionId(request.getProductOptionId());
                    ci.setQuantity(request.getQuantity());
                    return ci;
                });

        CartItem saved = cartItemRepository.save(item);

        // 3. response minimal
        return AddCartItemResponse.builder()
                .cartItemId(saved.getId())
                .productId(saved.getProductId())
                .productOptionId(saved.getProductOptionId())
                .quantity(saved.getQuantity())
                .build();
    }

    public GetUserCartResponse getCart(String uid){
        UUID userId = UUID.fromString(uid);
        // 1. หา session
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);

        if (session == null) {
            return GetUserCartResponse.builder()
                    .shops(Collections.emptyList())
                    .count(0)
                    .build();
        }

        // 2. query
        List<Object[]> rows = cartItemRepository.getCartRaw(session.getId());

        if (rows.isEmpty()) {
            return GetUserCartResponse.builder()
                    .shops(Collections.emptyList())
                    .count(0)
                    .build();
        }

        // 3. group
        Map<UUID, GetUserCartResponse.Shop> shopMap = new LinkedHashMap<>();
        Map<UUID, Map<UUID, GetUserCartResponse.ProductItem>> productMap = new HashMap<>();

        for (Object[] r : rows) {

            UUID shopId = (UUID) r[0];
            String shopName = (String) r[1];

            UUID productId = (UUID) r[2];
            String productName = (String) r[3];

            UUID cartItemId =(UUID) r[4];
            UUID optionId = r[5] != null ? (UUID) r[5] : null;
            String optionName = (String) r[6];

            String image = (String) r[7];
            Double amount = (Double) r[8];
            Integer quantity = (Integer) r[9];

            // shop
            GetUserCartResponse.Shop shop = shopMap.computeIfAbsent(
                    shopId,
                    id -> GetUserCartResponse.Shop.builder()
                            .id(id)
                            .shopName(shopName)
                            .productItems(new ArrayList<>())
                            .build()
            );

            // product map ต่อ shop
            productMap.putIfAbsent(shopId, new LinkedHashMap<>());
            Map<UUID, GetUserCartResponse.ProductItem> productByShop = productMap.get(shopId);

            // product
            GetUserCartResponse.ProductItem product = productByShop.computeIfAbsent(
                    productId,
                    id -> {
                        GetUserCartResponse.ProductItem p = GetUserCartResponse.ProductItem.builder()
                                .id(id)
                                .productName(productName)
                                .optionItems(new ArrayList<>())
                                .build();
                        shop.getProductItems().add(p);
                        return p;
                    }
            );

            // option
            product.getOptionItems().add(
                    GetUserCartResponse.OptionItem.builder()
                            .cartItemId(cartItemId)
                            .id(optionId)
                            .optionName(optionName)
                            .image(image)
                            .amount(amount)
                            .currency("THB")
                            .quantity(quantity)
                            .build()
            );
        }

        return GetUserCartResponse.builder()
                .shops(new ArrayList<>(shopMap.values()))
                .count(rows.size())
                .build();
    }

    public ModCartItemResponse updateQuantity(String uuid, UUID cartItemId, UpdateCartItemRequest request) {
        UUID userId = UUID.fromString(uuid);
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);
        UUID sessionId = session.getId();
        Integer quantity = request.getQuantity();

        if (quantity == null || quantity < 0) {
            throw new GlobalException("INVALID_QUANTITY","INVALID_QUANTITY", HttpStatus.BAD_REQUEST);
        }

        // 🔴 delete case
        if (quantity == 0) {
            int deleted = cartItemRepository.deleteItem(cartItemId, sessionId);

            if (deleted == 0) {
                throw new GlobalException("CART_ITEM_NOT_FOUND","CART_ITEM_NOT_FOUND", HttpStatus.NOT_FOUND);
            }

            return ModCartItemResponse.builder()
                    .cartItemId(cartItemId)
                    .deleted(true)
                    .build();
        }

        // 🟢 update case
        int updated = cartItemRepository.updateQuantity(cartItemId, sessionId, quantity);

        if (updated == 0) {
            throw new GlobalException("CART_ITEM_NOT_FOUND","CART_ITEM_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return ModCartItemResponse.builder()
                .cartItemId(cartItemId)
                .quantity(quantity)
                .deleted(false)
                .build();
    }

    public DeleteCartItemResponse deleteItem(String uuid,UUID cartItemId){
        UUID userId = UUID.fromString(uuid);
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);
        UUID sessionId = session.getId();

        int deleted = cartItemRepository.deleteItem(cartItemId, sessionId);

        if (deleted == 0) {
            throw new GlobalException("CART_ITEM_NOT_FOUND","CART_ITEM_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return DeleteCartItemResponse.builder()
                .cartItemId(cartItemId)
                .build();
    }

    public DeleteCartItemsResponse deleteItems(String uuid, DeleteCartItemsRequest request){
        UUID userId = UUID.fromString(uuid);
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);
        UUID sessionId = session.getId();

        List<UUID> cartItemIds = request.getCartItemId();
        int deleted = cartItemRepository.deleteItems(cartItemIds, sessionId);

        if (deleted == 0) {
            throw new GlobalException("CART_ITEM_NOT_FOUND","CART_ITEM_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return DeleteCartItemsResponse.builder()
                .cartItemsId(cartItemIds)
                .build();
    }

    public GetCartCountResponse getCartCount(String uuid){
        UUID userId = UUID.fromString(uuid);
        ShoppingSession session = shoppingSessionRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);
        UUID sessionId = session.getId();

        int counted = cartItemRepository.countBySessionId(sessionId);

        return GetCartCountResponse.builder()
                .count(counted)
                .build();
    }

}
