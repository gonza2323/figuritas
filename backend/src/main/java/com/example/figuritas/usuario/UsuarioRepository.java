package com.example.figuritas.usuario;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByUsernameAndEliminadoFalse(String name);

    Optional<Usuario> findByIdAndEliminadoFalse(Long id);
    Optional<Usuario> findByUsernameAndEliminadoFalse(String nombre);
}
