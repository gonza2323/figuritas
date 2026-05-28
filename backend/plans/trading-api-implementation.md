# Implementation Plan - Figuritas Trading API

This plan outlines the steps to implement the figuritas trading application backend, focusing on matching users based on their owned and wanted stickers.

## Objective
Implement endpoints for managing personal figurita status (owned/wanted) and finding matches with other users on a map.

## Key Files & Context
- **Entities**: `Usuario`, `Figurita`, `FiguritaUsuarioDuenio`, `FiguritaUsuarioQuiere`.
- **DTOs**: `FiguritaDto`, `UsuarioViewDto`, `MatchDto`, `FiguritaStatusUpdateDto`.
- **Services**: `FiguritaService`, `UsuarioService`.
- **Controllers**: `FiguritaController`.

## Implementation Steps

### 1. Entity & Repository Updates
- **Usuario.java**:
    - Add `Double latitude` and `Double longitude`.
    - Rename `rol` field to `avatar` (type `Imagen`).
- **Repositories**:
    - Create `FiguritaUsuarioDuenioRepository` with methods:
        - `List<FiguritaUsuarioDuenio> findAllByUsuarioId(Long usuarioId)`
        - `Optional<FiguritaUsuarioDuenio> findByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId)`
        - `void deleteByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId)`
    - Create `FiguritaUsuarioQuiereRepository` with methods:
        - `List<FiguritaUsuarioQuiere> findAllByUsuarioId(Long usuarioId)`
        - `Optional<FiguritaUsuarioQuiere> findByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId)`
        - `void deleteByUsuarioIdAndFiguritaId(Long usuarioId, Long figuritaId)`

### 2. DTO & Mapper Updates
- **FiguritaDto.java**: Add `Long imagenId`.
- **UsuarioViewDto.java**: Add `Double latitude`, `Double longitude`, `Long avatarId`.
- **Create MatchDto.java**:
    - `UsuarioViewDto user`
    - `List<FiguritaDto> matchingFiguritas`
- **Create FiguritaStatusUpdateDto.java**:
    - `boolean owned`
    - `boolean wanted`
- **UsuarioMapper.java**: Update to map `avatar.id` to `avatarId`.
- **Create FiguritaMapper.java**: Map `Figurita` to `FiguritaDto`, mapping `imagen.id` to `imagenId`.

### 3. Service Implementation (`FiguritaService.java`)
- `List<FiguritaDto> getMyFiguritas(Long currentUserId)`:
    - Fetch all figuritas.
    - Fetch owned and wanted sets for the current user.
    - Map each figurita to `FiguritaDto` with status.
- `void updateFiguritaStatus(Long currentUserId, Long figuritaId, FiguritaStatusUpdateDto status)`:
    - Update `FiguritaUsuarioDuenio` and `FiguritaUsuarioQuiere` based on the boolean flags.
- `List<MatchDto> getMatches(Long currentUserId)`:
    - Get IDs of figuritas current user wants.
    - Find all users (excluding self).
    - For each user, find owned figuritas that are in the "wanted" set of the current user.
    - If matches found, add to result list.
- `MatchDto getUserMatch(Long currentUserId, Long targetUserId)`:
    - Similar logic but for a specific user.

### 4. Controller Implementation (`FiguritaController.java`)
- Implement `GET /api/me/figuritas`.
- Implement `PATCH /api/me/figuritas/{figuritaId}`.
- Implement `GET /api/me/matches`.
- Implement `GET /api/me/matches/{userId}`.

## Verification & Testing
- Unit tests for `FiguritaService` matching logic.
- Integration tests for endpoints using `MockMvc`.
- Verify image IDs in DTOs match existing `/api/imagenes/{id}` endpoint.
