package com.mikan.restapi.model.payment.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class PaymentPreviewRequest {
    private List<ItemRequest> items;
    private List<UUID> selectedCartItemIds;

    @AssertTrue(message = "Provide either items or selectedCartItemIds, not both")
    @JsonIgnore
    public boolean checkInputMode() {
        return (items != null) ^ (selectedCartItemIds != null);
    }

    @Getter
    @Setter
    public static class ItemRequest {
        private UUID productOptionId;
        private Integer quantity;
    }
}
