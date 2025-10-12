package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;
import com.taller.ingenieria.api.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoControllerImpl implements PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Override
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody CheckoutRequestDTO checkoutDTO) {
        PedidoResponseDTO pedidoCreado = pedidoService.crearPedido(checkoutDTO);
        return new ResponseEntity<>(pedidoCreado, HttpStatus.CREATED);
    }
}