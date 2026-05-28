package com.example.figuritas.figurita;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FiguritaStatusUpdateDto {
    private boolean owned;
    private boolean wanted;
}
