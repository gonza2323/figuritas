package com.example.figuritas.figurita;

import com.example.figuritas.entity.BaseEntity;
import com.example.figuritas.imagen.Imagen;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class Figurita extends BaseEntity {
    @Column
    private String nombre;

    @ManyToOne(optional = false)
    private Imagen imagen;
}
