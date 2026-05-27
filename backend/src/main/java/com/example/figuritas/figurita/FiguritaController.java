package com.example.figuritas.figurita;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FiguritaController {
    @GetMapping("/me/figuritas")
    public List<FiguritaDto> getMyFiguritas() {
        // TODO Aquí iría la lógica para obtener las figuritas del usuario autenticado
        return new ArrayList<>();
    }
}
