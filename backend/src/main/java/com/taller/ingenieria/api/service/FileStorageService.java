package com.taller.ingenieria.api.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * Almacena un archivo subido por el usuario.
     * @param file El archivo MultipartFile recibido en la petición.
     * @return La URL completa para acceder al archivo guardado.
     */
    String storeFile(MultipartFile file);

    /**
     * Carga un archivo como un recurso (Resource).
     * @param filename El nombre del archivo a cargar.
     * @return El archivo como un objeto Resource.
     */
    Resource loadFileAsResource(String filename);
}