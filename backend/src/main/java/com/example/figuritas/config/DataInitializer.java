package com.example.figuritas.config;

import com.example.figuritas.figurita.*;
import com.example.figuritas.imagen.Imagen;
import com.example.figuritas.imagen.ImagenRepository;
import com.example.figuritas.imagen.TipoImagen;
import com.example.figuritas.usuario.Usuario;
import com.example.figuritas.usuario.UsuarioRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final FiguritaRepository figuritaRepository;
    private final ImagenRepository imagenRepository;
    private final UsuarioRepository usuarioRepository;
    private final FiguritaUsuarioDuenioRepository figuritaUsuarioDuenioRepository;
    private final FiguritaUsuarioQuiereRepository figuritaUsuarioQuiereRepository;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties properties;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        boolean skipFiguritas = figuritaRepository.count() > 0;
        boolean skipUsuarios = usuarioRepository.count() > 0;

        if (skipFiguritas && skipUsuarios) {
            log.info("Data already exists, skipping initialization.");
            return;
        }

        if (!skipFiguritas) {
            initializeFiguritas();
        }

        if (!skipUsuarios) {
            initializeUsuarios();
        }

        log.info("Data initialization complete.");
    }

    private void initializeFiguritas() throws Exception {
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
                    imagen = loadImagenFromPath("classpath:figus/img/" + entry.getArchivoImagen(), TipoImagen.FIGURITA);
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
    }

    private void initializeUsuarios() {
        log.info("Initializing users data...");
        List<Imagen> avatars = loadAvatars();
        List<Figurita> figuritas = figuritaRepository.findAll();

        Random random = new Random(properties.data().seed());
        String encodedPassword = passwordEncoder.encode("password");

        for (int i = 0; i < properties.data().userCount(); i++) {
            String username = String.format("user%02d", i);

            double lat = properties.data().baseLatitude() + (random.nextDouble() - 0.5) * properties.data().positionOffset();
            double lon = properties.data().baseLongitude() + (random.nextDouble() - 0.5) * properties.data().positionOffset();

            Usuario usuario = Usuario.builder()
                    .username(username)
                    .password(encodedPassword)
                    .avatar(avatars.isEmpty() ? null : avatars.get(random.nextInt(avatars.size())))
                    .latitude(lat)
                    .longitude(lon)
                    .build();

            usuario = usuarioRepository.save(usuario);

            // Randomly assign owned figuritas
            int ownedCount = random.nextInt(10) + 5;
            Set<Long> ownedIds = new HashSet<>();
            for (int j = 0; j < ownedCount; j++) {
                Figurita fig = figuritas.get(random.nextInt(figuritas.size()));
                if (ownedIds.add(fig.getId())) {
                    figuritaUsuarioDuenioRepository.save(FiguritaUsuarioDuenio.builder()
                            .usuario(usuario)
                            .figurita(fig)
                            .build());
                }
            }

            // Randomly assign wanted figuritas
            int wantedCount = random.nextInt(10) + 5;
            Set<Long> wantedIds = new HashSet<>();
            for (int j = 0; j < wantedCount; j++) {
                Figurita fig = figuritas.get(random.nextInt(figuritas.size()));
                if (!ownedIds.contains(fig.getId()) && wantedIds.add(fig.getId())) {
                    figuritaUsuarioQuiereRepository.save(FiguritaUsuarioQuiere.builder()
                            .usuario(usuario)
                            .figurita(fig)
                            .build());
                }
            }
        }
    }

    private List<Imagen> loadAvatars() {
        List<Imagen> avatars = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            String fileName = String.format("avatar_%02d.png", i);
            Imagen imagen = loadImagenFromPath("classpath:users/avatars/" + fileName, TipoImagen.USUARIO);
            if (imagen != null) {
                avatars.add(imagenRepository.save(imagen));
            }
        }
        return avatars;
    }

    private Imagen loadImagenFromPath(String path, TipoImagen tipo) {
        try {
            Resource imgResource = resourceLoader.getResource(path);
            if (!imgResource.exists()) {
                log.warn("Image file not found: {}", path);
                return null;
            }
            try (InputStream is = imgResource.getInputStream()) {
                byte[] content = is.readAllBytes();
                String fileName = imgResource.getFilename();
                String mime = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
                return Imagen.builder()
                        .nombre(fileName)
                        .mime(mime)
                        .tipo(tipo)
                        .contenido(content)
                        .build();
            }
        } catch (Exception e) {
            log.error("Error loading image {}: {}", path, e.getMessage());
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
