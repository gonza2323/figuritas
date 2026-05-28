package com.example.figuritas.usuario;

import com.example.figuritas.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public Usuario find(Long id) {
        return repository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public UsuarioViewDto findDto(Long id) {
        return usuarioMapper.toDto(find(id));
    }

    @Transactional
    public Usuario createUserFromUsernamePassword(UserCreateDto dto) {
        validarUsername(dto.getUsername());
        validarClave(dto.getPassword(), dto.getPasswordConfirm());

        String passwordHash = passwordEncoder.encode(dto.getPassword());

        Usuario usuario = Usuario.builder()
                .username(dto.getUsername())
                .password(passwordHash)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();

        return repository.save(usuario);
    }

    private void validarClave(String password, String passwordConfirm) {
        if (!password.equals(passwordConfirm))
            throw new BusinessException("Las contraseñas no coinciden");
    }

    private void validarUsername(String nombre) {
        boolean taken = repository.existsByUsernameAndEliminadoFalse(nombre);
        if (taken)
            throw new BusinessException("Ese nombre de usuario ya está registrado");
    }

    public void delete(Usuario usuario) {
        usuario.setEliminado(true);
    }
}
