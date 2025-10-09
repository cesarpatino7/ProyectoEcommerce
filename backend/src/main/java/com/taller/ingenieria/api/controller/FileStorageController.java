package com.taller.ingenieria.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Almacenamiento de Archivos", description = "Endpoints para subir y descargar archivos (imágenes de productos).")
public interface FileStorageController {

    @Operation(
            summary = "Subir un archivo de imagen",
            description = "Recibe un archivo (imagen), lo guarda en el servidor con un nombre único y devuelve la URL pública para acceder a él. " +
                    "Esta URL es la que se debe usar al crear o actualizar un producto. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @RequestBody(
            description = "Archivo a subir.",
            required = true,
            content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Archivo subido exitosamente. La respuesta es la URL de descarga.",
                    content = { @Content(mediaType = "text/plain", schema = @Schema(type = "string", example = "http://localhost:8080/api/v1/files/download/a1b2c3d4.jpg")) }
            ),
            @ApiResponse(responseCode = "400", description = "No se proporcionó ningún archivo en la petición.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere un rol de PRODUCT_MANAGER o SUPER_ADMIN.", content = @Content)
    })
    ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file);


    @Operation(
            summary = "Descargar/ver un archivo",
            description = "Devuelve el contenido de un archivo (imagen) basado en su nombre único. Este endpoint es público y es el que usan los navegadores para mostrar las imágenes de los productos."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Archivo encontrado. El contenido se devuelve en el cuerpo de la respuesta.",
                    content = { @Content(mediaType = "image/jpeg"),
                            @Content(mediaType = "image/png"),
                            @Content(mediaType = "application/octet-stream") }
            ),
            @ApiResponse(responseCode = "404", description = "Archivo no encontrado.", content = @Content)
    })
    ResponseEntity<Resource> downloadFile(
            @Parameter(description = "Nombre único del archivo a descargar (incluyendo la extensión).", required = true, example = "a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg")
            @PathVariable String fileName,
            HttpServletRequest request);
}