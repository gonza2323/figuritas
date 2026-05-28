package com.example.figuritas.figurita;

import com.example.figuritas.error.BusinessException;
import com.example.figuritas.usuario.Usuario;
import com.example.figuritas.usuario.UsuarioMapper;
import com.example.figuritas.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FiguritaService {

    private final FiguritaRepository figuritaRepository;
    private final FiguritaUsuarioDuenioRepository duenioRepository;
    private final FiguritaUsuarioQuiereRepository quiereRepository;
    private final UsuarioRepository usuarioRepository;
    private final FiguritaMapper figuritaMapper;
    private final UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public List<FiguritaDto> getMyFiguritas(Long userId) {
        List<Figurita> allFiguritas = figuritaRepository.findAll();
        Set<Long> ownedIds = duenioRepository.findAllByUsuarioId(userId).stream()
                .map(d -> d.getFigurita().getId())
                .collect(Collectors.toSet());
        Set<Long> wantedIds = quiereRepository.findAllByUsuarioId(userId).stream()
                .map(q -> q.getFigurita().getId())
                .collect(Collectors.toSet());

        return allFiguritas.stream().map(f -> {
            FiguritaDto dto = figuritaMapper.toDto(f);
            dto.setOwned(ownedIds.contains(f.getId()));
            dto.setWanted(wantedIds.contains(f.getId()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateFiguritaStatus(Long userId, Long figuritaId, FiguritaStatusUpdateDto dto) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        Figurita figurita = figuritaRepository.findById(figuritaId)
                .orElseThrow(() -> new BusinessException("Figurita no encontrada"));

        // Update Owned
        duenioRepository.findByUsuarioIdAndFiguritaId(userId, figuritaId)
                .ifPresentOrElse(
                        d -> { if (!dto.isOwned()) duenioRepository.delete(d); },
                        () -> { if (dto.isOwned()) duenioRepository.save(FiguritaUsuarioDuenio.builder().usuario(usuario).figurita(figurita).build()); }
                );

        // Update Wanted
        quiereRepository.findByUsuarioIdAndFiguritaId(userId, figuritaId)
                .ifPresentOrElse(
                        q -> { if (!dto.isWanted()) quiereRepository.delete(q); },
                        () -> { if (dto.isWanted()) quiereRepository.save(FiguritaUsuarioQuiere.builder().usuario(usuario).figurita(figurita).build()); }
                );
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getMatches(Long currentUserId) {
        Set<Long> wantedIds = quiereRepository.findAllByUsuarioId(currentUserId).stream()
                .map(q -> q.getFigurita().getId())
                .collect(Collectors.toSet());

        if (wantedIds.isEmpty()) return List.of();

        List<Usuario> otherUsers = usuarioRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .collect(Collectors.toList());

        return otherUsers.stream()
                .map(u -> getMatchForUser(u, wantedIds))
                .filter(m -> !m.getMatchingFiguritas().isEmpty())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchDto getUserMatch(Long currentUserId, Long targetUserId) {
        Usuario targetUser = usuarioRepository.findById(targetUserId)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        Set<Long> wantedIds = quiereRepository.findAllByUsuarioId(currentUserId).stream()
                .map(q -> q.getFigurita().getId())
                .collect(Collectors.toSet());

        return getMatchForUser(targetUser, wantedIds);
    }

    private MatchDto getMatchForUser(Usuario user, Set<Long> wantedIds) {
        List<FiguritaDto> matchingFiguritas = duenioRepository.findAllByUsuarioId(user.getId()).stream()
                .filter(d -> wantedIds.contains(d.getFigurita().getId()))
                .map(d -> {
                    FiguritaDto dto = figuritaMapper.toDto(d.getFigurita());
                    dto.setOwned(true);
                    return dto;
                })
                .collect(Collectors.toList());

        return MatchDto.builder()
                .user(usuarioMapper.toDto(user))
                .matchingFiguritas(matchingFiguritas)
                .build();
    }
}
