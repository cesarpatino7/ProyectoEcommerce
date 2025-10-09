package com.taller.ingenieria.api.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageContraller {
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file);

    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request);
}
