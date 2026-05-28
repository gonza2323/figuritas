package com.example.figuritas.figurita;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FiguritaMapper {
    @Mapping(source = "imagen.id", target = "imagenId")
    @Mapping(target = "owned", ignore = true)
    @Mapping(target = "wanted", ignore = true)
    FiguritaDto toDto(Figurita figurita);
}
