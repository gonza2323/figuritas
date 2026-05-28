package com.example.figuritas.auth;

import com.example.figuritas.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessTokenService {

    private final JwtEncoder encoder;
    private final AppProperties config;

    public AccessTokenDto createToken(Long userId) {
        AppProperties.Auth.AccessToken tokenConfig = config.auth().accessToken();
        Instant now = Instant.now();
        Instant expiryDate = now.plusSeconds(60 * tokenConfig.durationMinutes());

        JwsHeader jwsHeader = JwsHeader.with(() -> "HS256").build();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(expiryDate)
                .subject(userId.toString())
                .claim("roles", List.of("USER"))
                .build();

        String encodedToken = this.encoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();

        return AccessTokenDto.builder()
                .value(encodedToken)
                .expiryDate(expiryDate)
                .build();
    }
}
