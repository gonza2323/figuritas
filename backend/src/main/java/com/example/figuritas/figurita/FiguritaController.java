package com.example.figuritas.figurita;

import com.example.figuritas.auth.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FiguritaController {

    private final FiguritaService figuritaService;

    @GetMapping("/me/figuritas")
    public List<FiguritaDto> getMyFiguritas(@AuthenticationPrincipal CurrentUser currentUser) {
        return figuritaService.getMyFiguritas(currentUser.getId());
    }

    @PatchMapping("/me/figuritas/{figuritaId}")
    public void updateFiguritaStatus(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long figuritaId,
            @RequestBody FiguritaStatusUpdateDto dto) {
        figuritaService.updateFiguritaStatus(currentUser.getId(), figuritaId, dto);
    }

    @GetMapping("/me/matches")
    public List<MatchDto> getMatches(@AuthenticationPrincipal CurrentUser currentUser) {
        return figuritaService.getMatches(currentUser.getId());
    }

    @GetMapping("/me/matches/{userId}")
    public MatchDto getUserMatch(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long userId) {
        return figuritaService.getUserMatch(currentUser.getId(), userId);
    }
}
