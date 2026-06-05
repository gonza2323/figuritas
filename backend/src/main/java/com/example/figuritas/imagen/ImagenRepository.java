package com.example.figuritas.imagen;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImagenRepository extends JpaRepository<Imagen, Long> {
    Optional<Imagen> findByIdAndEliminadoFalse(Long id);

    List<Imagen> findByTipo(TipoImagen tipo);
}
