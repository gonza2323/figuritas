package com.example.figuritas.usuario;


import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    @org.mapstruct.Mapping(source = "avatar.id", target = "avatarId")
    UsuarioViewDto toDto(Usuario usuario);
}
