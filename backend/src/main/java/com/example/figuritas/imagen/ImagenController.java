package com.example.figuritas.imagen;

import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/imagenes")
@RequiredArgsConstructor
public class ImagenController {
    private final ImagenService service;

    @GetMapping("/{imagenId}")
    public ResponseEntity<byte[]> getImagen(@PathVariable Long imagenId) {
        ImagenViewDto imagen = service.findDto(imagenId);

        CacheControl cacheControl = CacheControl
                .maxAge(24, TimeUnit.HOURS)
                .cachePublic();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imagen.getNombre() + "\"")
                .contentType(MediaType.parseMediaType(imagen.getMime()))
                .cacheControl(cacheControl)
                .body(imagen.getContenido());
    }
}
