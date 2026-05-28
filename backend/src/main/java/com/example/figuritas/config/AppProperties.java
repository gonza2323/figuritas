package com.example.figuritas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Auth auth,
    Data data
) {
    public record Auth(AccessToken accessToken
    ) {
        public record AccessToken(
            String secret,
            long durationMinutes
        ) {}
    }

    public record Data(
            Long seed,
            int userCount,
            double baseLatitude,
            double baseLongitude,
            double positionOffset
    ) {}
}