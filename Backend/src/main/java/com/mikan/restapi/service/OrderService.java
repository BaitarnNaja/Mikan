package com.mikan.restapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mikan.restapi.entity.*;
import com.mikan.restapi.model.Metadata;
import com.mikan.restapi.model.order.request.CancelOrderRequest;
import com.mikan.restapi.model.order.request.CreateOrderRequest;
import com.mikan.restapi.model.order.response.CancelOrderResponse;
import com.mikan.restapi.model.order.response.CreateOrderResponse;
import com.mikan.restapi.model.order.response.GetOrderResponse;
import com.mikan.restapi.model.order.response.WatchOrderResponse;
import com.mikan.restapi.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    private final OrderDetailsRepository orderDetailsRepository;
    private final OrderShopsRepository orderShopsRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderShopStatusHistoryRepository orderShopStatusHistoryRepository;
    private final ProductOptionalRepository productOptionalRepository;
    private final UsersRepository usersRepository;
    private final MerchantRepository merchantRepository;
    private final ShoppingSessionRepository shoppingSessionRepository;
    private final CartItemRepository cartItemRepository;
    private final ObjectMapper objectMapper;

    public OrderService(OrderDetailsRepository orderDetailsRepository,
                        OrderShopsRepository orderShopsRepository,
                        OrderItemsRepository orderItemsRepository,
                        OrderStatusHistoryRepository orderStatusHistoryRepository,
                        OrderShopStatusHistoryRepository orderShopStatusHistoryRepository,
                        ProductOptionalRepository productOptionalRepository,
                        UsersRepository usersRepository,
                        MerchantRepository merchantRepository, ShoppingSessionRepository shoppingSessionRepository, CartItemRepository cartItemRepository,
                        ObjectMapper objectMapper) {
        this.orderDetailsRepository = orderDetailsRepository;
        this.orderShopsRepository = orderShopsRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.orderShopStatusHistoryRepository = orderShopStatusHistoryRepository;
        this.productOptionalRepository = productOptionalRepository;
        this.usersRepository = usersRepository;
        this.merchantRepository = merchantRepository;
        this.shoppingSessionRepository = shoppingSessionRepository;
        this.cartItemRepository = cartItemRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public CreateOrderResponse createOrder(String userId, CreateOrderRequest request) {

        UUID uid = UUID.fromString(userId);
        Optional<Users> user = usersRepository.findById(uid);

        LocalDateTime now = LocalDateTime.now();

        Map<UUID, List<ItemWithOption>> itemsByMerchant = new LinkedHashMap<>();

        for (CreateOrderRequest.OrderItemDto dto : request.getItems()) {

            UUID optionId = dto.getProductOptionId();

            ProductOptional opt = productOptionalRepository.findById(optionId)
                    .orElseThrow(() -> new RuntimeException("Product option not found"));

            UUID merchantId = opt.getProduct().getMerchant().getId();

            itemsByMerchant
                    .computeIfAbsent(merchantId, k -> new ArrayList<>())
                    .add(new ItemWithOption(dto.getQuantity(), opt));
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (List<ItemWithOption> items : itemsByMerchant.values()) {
            for (ItemWithOption item : items) {
                subtotal = subtotal.add(
                        BigDecimal.valueOf(item.option().getPrice() * item.quantity())
                );
            }
        }

        BigDecimal totalShippingFee = BigDecimal.ZERO;
        Map<UUID, Merchant> merchantMap = new LinkedHashMap<>();

        for (UUID merchantId : itemsByMerchant.keySet()) {

            Merchant merchant = merchantRepository.findById(merchantId)
                    .orElseThrow(() -> new RuntimeException("Merchant not found"));

            merchantMap.put(merchantId, merchant);

            totalShippingFee = totalShippingFee.add(
                    BigDecimal.valueOf(merchant.getShippingFee())
            );
        }

        BigDecimal grandTotal = subtotal.add(totalShippingFee);

        String snapshot;

        try {
            snapshot = objectMapper.writeValueAsString(request.getShippingAddress());
        } catch (Exception e) {
            snapshot = "{}";
        }

        OrderDetails order = new OrderDetails();
        order.setUsers(user.get());
        order.setSubtotal(subtotal);
        order.setTotalShippingFee(totalShippingFee);
        order.setGrandTotal(grandTotal);
        order.setShippingAddressSnapshot(snapshot);
        order.setPaymentId(null);
        order.setCreatedAt(now);
        order.setModifiedAt(now);

        OrderDetails savedOrder = orderDetailsRepository.save(order);

        OrderStatusHistory orderHistory = new OrderStatusHistory();
        orderHistory.setOrderDetails(savedOrder);
        orderHistory.setStatus("PENDING_PAYMENT");
        orderHistory.setActorId(uid);
        orderHistory.setCreateAt(now);

        orderStatusHistoryRepository.save(orderHistory);

        List<CreateOrderResponse.OrderResponse> orderResponses = new ArrayList<>();

        for (Map.Entry<UUID, List<ItemWithOption>> entry : itemsByMerchant.entrySet()) {

            UUID merchantId = entry.getKey();
            Merchant merchant = merchantMap.get(merchantId);

            BigDecimal shopSubtotal = BigDecimal.ZERO;

            for (ItemWithOption item : entry.getValue()) {
                shopSubtotal = shopSubtotal.add(
                        BigDecimal.valueOf(item.option().getPrice() * item.quantity())
                );
            }

            OrderShops orderShop = new OrderShops();
            orderShop.setOrderDetails(savedOrder);
            orderShop.setMerchant(merchant);
            orderShop.setSubtotal(shopSubtotal);
            orderShop.setShippingFee(BigDecimal.valueOf(merchant.getShippingFee()));
            orderShop.setStatus("PENDING_PAYMENT");
            orderShop.setCreatedAt(now);
            orderShop.setModifiedAt(now);

            OrderShops savedShop = orderShopsRepository.save(orderShop);

            OrderShopStatusHistory shopHistory = new OrderShopStatusHistory();
            shopHistory.setOrderShops(savedShop);
            shopHistory.setStatus("PENDING_PAYMENT");
            shopHistory.setCreatedAt(now);

            orderShopStatusHistoryRepository.save(shopHistory);

            List<CreateOrderResponse.OrderResponse.OrderItemDetail> itemDetails = new ArrayList<>();

            for (ItemWithOption item : entry.getValue()) {

                String img = item.option().getImg() != null
                        ? item.option().getImg()
                        : (item.option().getProduct().getImgs() != null &&
                        !item.option().getProduct().getImgs().isEmpty()
                        ? item.option().getProduct().getImgs().get(0)
                        : null);

                OrderItems orderItem = new OrderItems();
                orderItem.setOrderShops(savedShop);
                orderItem.setProductOptional(item.option());
                orderItem.setProductName(item.option().getProduct().getProductName());
                orderItem.setOptionName(item.option().getOptionName());
                orderItem.setImg(img);
                orderItem.setQuantity(item.quantity());
                orderItem.setPrice(BigDecimal.valueOf(item.option().getPrice()));
                orderItem.setCreatedAt(now);
                orderItem.setModifiedAt(now);

                orderItemsRepository.save(orderItem);

                itemDetails.add(
                        CreateOrderResponse.OrderResponse.OrderItemDetail.builder()
                                .productId(item.option().getProduct().getId())
                                .productName(item.option().getProduct().getProductName())
                                .productOptionId(item.option().getId())
                                .optionName(item.option().getOptionName())
                                .img(img)
                                .quantity(String.valueOf(item.quantity()))
                                .price(String.valueOf(item.option().getPrice()))
                                .build()
                );
            }

            orderResponses.add(
                    CreateOrderResponse.OrderResponse.builder()
                            .id(savedShop.getId())
                            .shopId(merchant.getId())
                            .shopName(merchant.getShopName())
                            .createAt(savedShop.getCreatedAt().toString())
                            .status(savedShop.getStatus())
                            .orderItems(itemDetails)
                            .totalAmount(
                                    shopSubtotal
                                            .add(BigDecimal.valueOf(merchant.getShippingFee()))
                                            .toString()
                            )
                            .build()
            );
        }

        Optional<ShoppingSession> sessionOpt =
                shoppingSessionRepository.findByUserIdAndStatus(uid, "ACTIVE");

        sessionOpt.ifPresent(session -> {
            for (CreateOrderRequest.OrderItemDto dto : request.getItems()) {
                cartItemRepository.deleteBySessionIdAndProductOptionIdAndQuantity(
                        session.getId(),
                        dto.getProductOptionId(),
                        dto.getQuantity()
                );
            }
        });

        return CreateOrderResponse.builder()
                .orderId(savedOrder.getId())
                .totalAmount(grandTotal.intValue())
                .paymentUrl("")
                .status("PENDING_PAYMENT")
                .orderResponses(orderResponses)
                .build();
    }

    public GetOrderResponse getUserOrders(String userId, String shopOrderId,
                                          String startDate, String endDate,
                                          int page, int limit) {

        UUID uid = UUID.fromString(userId);
        int offset = (page - 1) * limit;

        List<Object[]> rows = orderShopsRepository.findUserOrders(
                uid, shopOrderId, startDate, endDate, limit, offset
        );

        int total = orderShopsRepository.countUserOrders(
                uid, shopOrderId, startDate, endDate
        );

        // group by order_shop_id
        Map<UUID, GetOrderResponse.OrderResponse> shopMap = new LinkedHashMap<>();

        for (Object[] row : rows) {

            UUID orderShopId = UUID.fromString(row[0].toString());

            shopMap.computeIfAbsent(orderShopId, k ->
                    GetOrderResponse.OrderResponse.builder()
                            .id(orderShopId)
                            .status(row[1].toString())
                            .createAt(row[2].toString())
                            .totalAmount(row[3].toString())
                            .shopId(UUID.fromString(row[4].toString()))
                            .shopName(row[5].toString())
                            .orderItems(new ArrayList<>())
                            .build()
            );

            shopMap.get(orderShopId).getOrderItems().add(
                    GetOrderResponse.OrderResponse.OrderItemDetail.builder()
                            // ❗ ไม่มี productId ใน query → ใส่ null ไปก่อน
                            .productId(null)
                            .productName(row[12].toString())
                            .productOptionId(UUID.fromString(row[9].toString()))
                            .optionName(row[10].toString())
                            .img(row[11] != null ? row[11].toString() : null)
                            .quantity(row[7].toString())
                            .price(row[8].toString())
                            .build()
            );
        }

        // ✅ สร้าง metadata
        Metadata metadata = Metadata.builder()
                .page(page)
                .limit(limit)
                .total(total)
                .build();

        // ✅ return แบบใหม่
        return GetOrderResponse.builder()
                .metadata(metadata)
                .orderResponses(new ArrayList<>(shopMap.values()))
                .build();
    }

    public WatchOrderResponse getOrderDetail(String userId, String orderShopId) {

        List<Object[]> rows = orderShopsRepository.findOrderDetail(orderShopId, userId);

        if (rows.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Object[] first = rows.get(0);

        WatchOrderResponse.ShippingAddressDto shippingAddress;
        try {
            shippingAddress = objectMapper.readValue(
                    first[15].toString(),
                    WatchOrderResponse.ShippingAddressDto.class
            );
        } catch (Exception e) {
            shippingAddress = null;
        }

        BigDecimal subtotal = new BigDecimal(first[3].toString());
        BigDecimal shippingFee = new BigDecimal(first[4].toString());

        List<WatchOrderResponse.OrderItemDetail> items = new ArrayList<>();

        for (Object[] row : rows) {
            items.add(
                    WatchOrderResponse.OrderItemDetail.builder()
                            .productName(row[14].toString())   // เดิม 15 → ตอนนี้ 14
                            .optionId((UUID) row[11])
                            .optionName(row[12].toString())
                            .image(row[13] != null ? row[13].toString() : null)
                            .quantity(Integer.parseInt(row[9].toString()))
                            .price(Float.parseFloat(row[10].toString()))
                            .build()
            );
        }

        return WatchOrderResponse.builder()
                .id((UUID) first[0])
                .status(first[1].toString())
                .createdAt(first[2].toString())
                .merchant(WatchOrderResponse.MerchantDto.builder()
                        .id((UUID) first[7])
                        .shopName(first[8].toString())
                        .build())
                .items(items)
                .summary(WatchOrderResponse.SummaryDto.builder()
                        .subtotal(subtotal)
                        .shippingFee(shippingFee)
                        .total(subtotal.add(shippingFee))
                        .build())
                .tracking(WatchOrderResponse.TrackingDto.builder()
                        .carrier(first[5] != null ? first[5].toString() : null)
                        .trackingNumber(first[6] != null ? first[6].toString() : null)
                        .build())
                .shippingAddress(shippingAddress)
                .build();
    }

    public CancelOrderResponse cancelOrder(UUID orderShopId, String userId, CancelOrderRequest request) {

        UUID uid = UUID.fromString(userId);

        // 1. Find order_shop & validate ownership
        OrderShops orderShop = orderShopsRepository.findByIdAndOrderDetails_Users_Id(orderShopId, uid)
                .orElseThrow(() -> new RuntimeException("Order not found or unauthorized"));

        // 2. Validate cancellable status (only PENDING_PAYMENT or PENDING can be cancelled)
        String currentStatus = orderShop.getStatus();
        if (!currentStatus.equals("PENDING_PAYMENT") && !currentStatus.equals("PENDING")) {
            throw new RuntimeException("Order cannot be cancelled. Current status: " + currentStatus);
        }

        // 3. Update order_shop status to CANCELLED
        orderShop.setStatus("CANCELLED");
        orderShop.setModifiedAt(LocalDateTime.now());
        orderShopsRepository.save(orderShop);

        // 4. Save order_shop_status_history
        OrderShopStatusHistory shopHistory = new OrderShopStatusHistory();
        shopHistory.setOrderShops(orderShop);
        shopHistory.setStatus("CANCELLED");
        shopHistory.setReason(request.getReasonCode() + ": " + request.getReasonDetail());
        shopHistory.setCreatedAt(LocalDateTime.now());
        orderShopStatusHistoryRepository.save(shopHistory);

        // 5. Check if ALL order_shops under same order_detail are CANCELLED
        //    → if yes, update order_details status to CANCELLED too
        OrderDetails orderDetail = orderShop.getOrderDetails();
        List<OrderShops> allShops = orderShopsRepository.findByOrderDetails_Id(orderDetail.getId());

        boolean allCancelled = allShops.stream()
                .allMatch(shop -> "CANCELLED".equals(shop.getStatus()));

        if (allCancelled) {
            orderDetail.setStatus("CANCELLED");
            orderDetail.setModifiedAt(LocalDateTime.now());
            orderDetailsRepository.save(orderDetail);

            // Save order_status_history for master order
            OrderStatusHistory orderHistory = new OrderStatusHistory();
            orderHistory.setOrderDetails(orderDetail);
            orderHistory.setStatus("CANCELLED");
            orderHistory.setReasonCode(request.getReasonCode());
            orderHistory.setReasonDetail(request.getReasonDetail());
            orderHistory.setActorId(uid);
            orderHistory.setCreateAt(LocalDateTime.now());
            orderStatusHistoryRepository.save(orderHistory);
        }

        // 6. TODO: If payment was already made → trigger refund via Omise

        // 7. Build response
        return CancelOrderResponse.builder()
                .message("Order cancelled successfully")
                .orderId(orderShopId)
                .status("CANCELLED")
                .cancelInfo(CancelOrderResponse.CancelInfo.builder()
                        .reasonCode(request.getReasonCode())
                        .reasonDetail(request.getReasonDetail())
                        .build())
                .build();
    }
    //Tool
    private record ItemWithOption(int quantity, ProductOptional option) {}
}
