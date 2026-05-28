package com.example.figuritas.usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioViewDto {
    private Long id;
    private String username;
    private Long avatarId;
    private Double latitude;
    private Double longitude;
}
