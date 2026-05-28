package com.example.figuritas.figurita;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FiguritaUsuarioDuenioRepository extends JpaRepository<FiguritaUsuarioDuenio, Long> {
    List<FiguritaUsuarioDuenio> findAllByUsuarioId(Long usuarioId);
    Optional<FiguritaUsuarioDuenio> findByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId);
    void deleteByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId);
}
