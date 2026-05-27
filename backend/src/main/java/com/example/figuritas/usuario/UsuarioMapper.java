package com.example.figuritas.usuario;


import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioViewDto toDto(Usuario usuario);
}
