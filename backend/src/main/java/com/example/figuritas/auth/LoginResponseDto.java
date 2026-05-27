package com.example.figuritas.auth;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    AccessTokenDto token;
    AuthUserDto user;
}
