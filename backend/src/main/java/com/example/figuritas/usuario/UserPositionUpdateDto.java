package com.example.figuritas.usuario;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPositionUpdateDto {
    @NotNull(message = "La latitud es obligatoria")
    private Double latitude;
    @NotNull(message = "La longitud es obligatoria")
    private Double longitude;
}
