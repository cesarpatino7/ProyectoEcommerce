package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CarritoResponseDTO {
    private Integer id;
    private List<ItemCarritoResponseDTO> items;
    private BigDecimal total;
}