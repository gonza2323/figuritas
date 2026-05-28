package com.example.figuritas.figurita;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FiguritaUsuarioQuiereRepository extends JpaRepository<FiguritaUsuarioQuiere, Long> {
    List<FiguritaUsuarioQuiere> findAllByUsuarioId(Long usuarioId);
    Optional<FiguritaUsuarioQuiere> findByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId);
    void deleteByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId);
}
