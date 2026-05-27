package com.example.figuritas.figurita;

import com.example.figuritas.entity.BaseEntity;
import com.example.figuritas.usuario.Usuario;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class FiguritaUsuarioDuenio extends BaseEntity {
    @ManyToOne(optional = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    private Figurita figurita;
}
