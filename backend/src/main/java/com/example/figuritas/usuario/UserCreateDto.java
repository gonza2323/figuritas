package com.example.figuritas.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDto {
    @NotNull(message = "Debe indicar un nombre de usuario")
    @Size(min = 4, max = 32, message = "Entre 4 y 32 caracteres")
    private String username;

    @NotNull(message = "Debe indicar una contraseña")
    @Size(min = 8, max = 255, message = "Entre 8 y 255 caracteres")
    private String password;

    @NotNull(message = "Debe confirmar la contraseña")
    private String passwordConfirm;

    private Double latitude;
    private Double longitude;
    }