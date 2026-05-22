package com.mikan.restapi.service;

import com.mikan.restapi.entity.CartItem;
import com.mikan.restapi.entity.Merchant;
import com.mikan.restapi.entity.Product;
import com.mikan.restapi.entity.ProductOptional;
import com.mikan.restapi.model.payment.request.PaymentPreviewRequest;
import com.mikan.restapi.model.payment.response.PaymentPreviewResponse;
import com.mikan.restapi.repository.CartItemRepository;
import com.mikan.restapi.repository.ProductOptionalRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final CartItemRepository cartItemRepository;
    private final ProductOptionalRepository productOptionalRepository;

    public PaymentService(CartItemRepository cartItemRepository,
                          ProductOptionalRepository productOptionalRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productOptionalRepository = productOptionalRepository;
    }

    public PaymentPreviewResponse preview(PaymentPreviewRequest req, UUID userId) {

        Map<UUID, PaymentPreviewResponse.Shop> shopMap = new LinkedHashMap<>();

        if (req.getItems() != null) {
            handleBuyNow(req.getItems(), shopMap);
        } else {
            handleCart(req.getSelectedCartItemIds(), userId, shopMap);
        }

        return buildSummary(shopMap);
    }

    // -------- CART --------
    private void handleCart(List<UUID> ids, UUID userId,
                            Map<UUID, PaymentPreviewResponse.Shop> shopMap) {

        List<CartItem> cartItems = cartItemRepository.findSelectedItems(ids, userId);

        for (CartItem ci : cartItems) {

            ProductOptional po = ci.getProductOption();

            Product p = po.getProduct();
            Merchant m = p.getMerchant();

            addItem(shopMap, m, p, po, ci.getQuantity(), ci.getId());
        }
    }

    // -------- BUY NOW --------
    private void handleBuyNow(List<PaymentPreviewRequest.ItemRequest> items,
                              Map<UUID, PaymentPreviewResponse.Shop> shopMap) {

        Map<UUID, Integer> qtyMap = items.stream()
                .collect(Collectors.toMap(
                        PaymentPreviewRequest.ItemRequest::getProductOptionId,
                        PaymentPreviewRequest.ItemRequest::getQuantity
                ));

        List<ProductOptional> options =
                productOptionalRepository.findAllWithProductAndMerchant(
                        new ArrayList<>(qtyMap.keySet())
                );

        for (ProductOptional po : options) {

            Product p = po.getProduct();
            Merchant m = p.getMerchant();

            addItem(shopMap, m, p, po, qtyMap.get(po.getId()), null);
        }
    }

    // -------- ADD ITEM --------
    private void addItem(Map<UUID, PaymentPreviewResponse.Shop> shopMap,
                         Merchant m, Product p, ProductOptional po,
                         Integer qty, UUID cartItemId) {

        PaymentPreviewResponse.Shop shop = shopMap.computeIfAbsent(
                m.getId(),
                id -> PaymentPreviewResponse.Shop.builder()
                        .shopId(id)
                        .shopName(m.getShopName())
                        .productItems(new ArrayList<>())
                        .shopSummary(
                                PaymentPreviewResponse.ShopSummary.builder()
                                        .shippingFee(m.getShippingFee().doubleValue()) //
                                        .subtotal(0.0)
                                        .build()
                        )
                        .build()
        );

        PaymentPreviewResponse.ProductItem product = shop.getProductItems().stream()
                .filter(pr -> pr.getProductId().equals(p.getId()))
                .findFirst()
                .orElseGet(() -> {
                    PaymentPreviewResponse.ProductItem pr =
                            PaymentPreviewResponse.ProductItem.builder()
                                    .productId(p.getId())
                                    .productName(p.getProductName())
                                    .optionItems(new ArrayList<>())
                                    .build();
                    shop.getProductItems().add(pr);
                    return pr;
                });

        product.getOptionItems().add(
                PaymentPreviewResponse.OptionItem.builder()
                        .optionId(po.getId())
                        .optionName(po.getOptionName())
                        .image(po.getImg())
                        .amount(po.getPrice())
                        .quantity(qty)
                        .cartItemId(cartItemId)
                        .build()
        );
    }

    // -------- SUMMARY --------
    private PaymentPreviewResponse buildSummary(
            Map<UUID, PaymentPreviewResponse.Shop> shopMap) {

        double totalSubtotal = 0;
        double totalShipping = 0;

        for (PaymentPreviewResponse.Shop shop : shopMap.values()) {

            double subtotal = 0;

            for (var product : shop.getProductItems()) {
                for (var opt : product.getOptionItems()) {
                    subtotal += opt.getAmount() * opt.getQuantity();
                }
            }

            double shipping = shop.getShopSummary().getShippingFee();

            shop.getShopSummary().setSubtotal(subtotal);

            totalSubtotal += subtotal;
            totalShipping += shipping;
        }

        return PaymentPreviewResponse.builder()
                .currency("THB")
                .shops(new ArrayList<>(shopMap.values()))
                .summary(
                        PaymentPreviewResponse.Summary.builder()
                                .subtotal(totalSubtotal)
                                .shippingFee(totalShipping)
                                .total(totalSubtotal + totalShipping)
                                .build()
                )
                .build();
    }
}