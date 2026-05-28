package com.example.figuritas.usuario;

import com.example.figuritas.entity.BaseEntity;
import com.example.figuritas.imagen.Imagen;
import jakarta.persistence.*;
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
public class Usuario extends BaseEntity {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    private Imagen avatar;

    @Column
    private Double latitude;

    @Column
    private Double longitude;
}
