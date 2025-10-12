package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class PedidoAdminDTO {

    private Integer id;
    private Instant fechaPedido;
    private String estado;
    private BigDecimal total;

    private Integer idUsuario;
    private String nombreUsuario;
    private String emailUsuario;

    private String telefonoUsuario;
    private String direccionEnvio;
}