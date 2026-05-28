package com.example.figuritas.config;


import com.example.figuritas.figurita.Figurita;
import com.example.figuritas.figurita.FiguritaRepository;
import com.example.figuritas.imagen.Imagen;
import com.example.figuritas.imagen.ImagenRepository;
import com.example.figuritas.imagen.TipoImagen;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FiguritaRepository figuritaRepository;
    private final ImagenRepository imagenRepository;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (figuritaRepository.count() > 0) {
            log.info("Figuritas already exist, skipping initialization.");
            return;
        }

        log.info("Initializing figuritas data...");

        Resource jsonResource = resourceLoader.getResource("classpath:figus/figus.json");
        if (!jsonResource.exists()) {
            log.warn("figus.json not found at classpath:figus/figus.json");
            return;
        }

        try (InputStream is = jsonResource.getInputStream()) {
            FigusData data = objectMapper.readValue(is, FigusData.class);
            Map<String, Imagen> loadedImages = new HashMap<>();

            for (FiguritaEntry entry : data.getFiguritas()) {
                Imagen imagen = loadedImages.get(entry.getArchivoImagen());
                if (imagen == null) {
                    imagen = loadImagen(entry.getArchivoImagen());
                    if (imagen != null) {
                        imagen = imagenRepository.save(imagen);
                        loadedImages.put(entry.getArchivoImagen(), imagen);
                    }
                }

                if (imagen != null) {
                    Figurita figurita = Figurita.builder()
                            .nombre(entry.getNombre())
                            .imagen(imagen)
                            .build();
                    figuritaRepository.save(figurita);
                } else {
                    log.warn("Could not load image {} for figurita {}", entry.getArchivoImagen(), entry.getNombre());
                }
            }
        }

        log.info("Data initialization complete.");
    }

    private Imagen loadImagen(String fileName) {
        try {
            Resource imgResource = resourceLoader.getResource("classpath:figus/img/" + fileName);
            if (!imgResource.exists()) {
                log.warn("Image file not found: {}", fileName);
                return null;
            }
            try (InputStream is = imgResource.getInputStream()) {
                byte[] content = is.readAllBytes();
                String mime = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
                return Imagen.builder()
                        .nombre(fileName)
                        .mime(mime)
                        .tipo(TipoImagen.FIGURITA)
                        .contenido(content)
                        .build();
            }
        } catch (Exception e) {
            log.error("Error loading image {}: {}", fileName, e.getMessage());
            return null;
        }
    }

    @Data
    private static class FigusData {
        private List<FiguritaEntry> figuritas;
    }

    @Data
    private static class FiguritaEntry {
        private String nombre;
        private String archivoImagen;
    }
}
