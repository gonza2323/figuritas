package com.example.figuritas.figurita;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
@AllArgsConstructor
public class FiguritaDto {
    private Long id;
    private String nombre;
    private boolean owned;
    private boolean wanted;
}
