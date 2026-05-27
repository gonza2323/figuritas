package com.example.figuritas.auth;

import com.example.figuritas.usuario.UserCreateDto;
import com.example.figuritas.usuario.Usuario;
import com.example.figuritas.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;

    public CustomUserDetails loginWithUsernamePassword(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        return (CustomUserDetails) authentication.getPrincipal();
    }

    public CurrentUser registerUserWithUsernameAndPassword(UserCreateDto userCreateDto) {
        Usuario usuario = usuarioService.createUserFromUsernamePassword(userCreateDto);
        return new CurrentUser(usuario.getId());
    }
}
