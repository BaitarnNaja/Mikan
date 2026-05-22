package com.mikan.restapi.model;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Data
public class Metadata {
    private long total;
    private int limit;
    private int page;
}
