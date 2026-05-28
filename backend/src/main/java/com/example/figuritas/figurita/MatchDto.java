package com.example.figuritas.figurita;

import com.example.figuritas.usuario.UsuarioViewDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@Builder
@AllArgsConstructor
public class MatchDto {
    private UsuarioViewDto user;
    private List<FiguritaDto> matchingFiguritas;
}
