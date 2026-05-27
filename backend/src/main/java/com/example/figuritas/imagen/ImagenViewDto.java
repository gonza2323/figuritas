package com.example.figuritas.imagen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ImagenViewDto {
    private Long id;
    private String nombre;
    private String mime;
    private TipoImagen tipo;
    private byte[] contenido;
}

