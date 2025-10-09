package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para que un SUPER_ADMIN cree un nuevo usuario con un rol específico. (No puede crear un usuario CUSTOMER)")
public class AdminUsuarioCreateRequestDTO extends UsuarioRegistroRequestDTO {

    @Schema(description = "ID del rol a asignar: 1. ROLE_CUSTOMER ; 2. ROLE_PRODUCT_MANAGER ; 3. ROLE_ORDER_MANAGER ; 4. ROLE_SUPER_ADMIN",
            example = "2", required = true)
    private Integer idRol;
}