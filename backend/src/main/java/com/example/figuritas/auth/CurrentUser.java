package com.example.figuritas.auth;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

@Getter
@RequiredArgsConstructor
public class CurrentUser implements Principal {

    private final Long id;

    @Override
    public String getName() {
        return id.toString();
    }
}
