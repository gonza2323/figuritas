package com.example.figuritas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Auth auth
) {
    public record Auth(AccessToken accessToken
    ) {
        public record AccessToken(
            String secret,
            long durationMinutes
        ) {}
    }
}