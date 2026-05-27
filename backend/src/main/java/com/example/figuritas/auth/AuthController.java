package com.example.figuritas.auth;

import com.example.figuritas.usuario.UserCreateDto;
import com.example.figuritas.usuario.Usuario;
import com.example.figuritas.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@EnableMethodSecurity(prePostEnabled = true)
public class AuthController {

    private final AccessTokenService accessTokenService;
    private final UsuarioService usuarioService;
    private final AuthService authService;

    @PostMapping("/login")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        CustomUserDetails user = authService.loginWithUsernamePassword(loginRequest);

        Usuario usuario = usuarioService.find(user.getId());
        AccessTokenDto accessToken = accessTokenService.createToken(user.getId());

        LoginResponseDto response = LoginResponseDto.builder()
                .token(accessToken)
                .user(new AuthUserDto(user.getId()))
                .build();

        return ResponseEntity.ok()
                .body(response);
    }

    @PostMapping("/signup")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<LoginResponseDto> signup(@RequestBody UserCreateDto loginRequest) {
        CurrentUser user = authService.registerUserWithUsernameAndPassword(loginRequest);

        Usuario usuario = usuarioService.find(user.getId());
        AccessTokenDto accessToken = accessTokenService.createToken(user.getId());

        LoginResponseDto response = LoginResponseDto.builder()
                .token(accessToken)
                .user(new AuthUserDto(user.getId()))
                .build();

        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserDto> authStatus(@AuthenticationPrincipal CurrentUser user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioService.find(user.getId());

        return ResponseEntity.ok(new AuthUserDto(user.getId()));
    }
}
