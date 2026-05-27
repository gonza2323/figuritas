package com.example.figuritas.imagen;

import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {
    @GetMapping("/{imagenId}")
    public String getImagen(@PathVariable Long imagenId) {
        // TODO Aquí iría la lógica para obtener una imagen
        return "Imagen";
    }
}
