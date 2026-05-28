# AGENTS.md - Figuritas Backend Development Guide

## Architecture Overview

**Stack**: Spring Boot 4.0.6, Java 17, SQLite + Hibernate, OAuth2 JWT, MapStruct/Lombok

**Domain Model**: Three-tier service architecture with entities managing figurita collections (collectible cards):
- **Figurita**: Core domain entity with 1:N relationship to Imagen (images)
- **Usuario**: Users with authentication, managing two possessive relationships:
  - `FiguritaUsuarioDuenio`: Figuritas player owns
  - `FiguritaUsuarioQuiere`: Figuritas player wants to trade for
- **Imagen**: Image storage with @Lob content (embedded files)

**Module Organization**: Each domain (auth, figurita, usuario, imagen) contains: Entity/DTO/Mapper, Repository, Service, Controller in flat hierarchy (`src/main/java/com/example/figuritas/{module}/`).

## Critical Patterns

### Entity & Soft-Delete Pattern
All entities inherit from `BaseEntity` with:
- `@GeneratedValue(strategy = IDENTITY)` for DB IDs
- `eliminado` Boolean flag for soft-delete (set true instead of deleting)
- Repository queries **must** include `.findByIdAndEliminadoFalse()` pattern

Example: `FiguritaRepository.findByIdAndEliminadoFalse(id)`

### Service Layer & Data Mapping
- Constructor injection for dependencies (no @Autowired)
- `@Transactional` on service methods modifying data
- MapStruct `@Mapper(componentModel = "spring")` for DTO ↔ Entity conversion
- Service methods return DTOs, never raw entities
- Query soft-deleted entities: `repository.findByIdAndEliminadoFalse(id)`

### Security: OAuth2 JWT
- Token generation: HMAC-SHA256, 99999-minute lifespan (configurable in `AppProperties`)
- Secret in `application.properties` as `app.auth.access-token.secret` (32+ characters)
- Login flow: POST `/auth/login` with credentials → create `UsernamePasswordAuthenticationToken` via `AuthenticationManager` → generate JWT in `AccessTokenDto`
- `CustomJwtAuthenticationConverter` converts JWT to `CustomUserDetails` with embedded authorities
- Password encoding: BCrypt (configured in `SecurityConfig`)

### Error Handling
- Throw `BusinessException(message)` for domain logic failures (unchecked exception)
- `GlobalExceptionHandler` catches and returns structured responses:
  - Validation errors: field-level error details
  - BusinessException: HTTP 400 with message
- Never throw generic RuntimeException; use BusinessException

## Developer Workflows

### Build & Test
```bash
# Compile
./mvnw clean compile

# Run tests
./mvnw test

# Package
./mvnw clean package

# Run application
./mvnw spring-boot:run
```

### Database
- SQLite: `figuritas.db` in project root (auto-created)
- Hibernate DDL mode: `update` (non-destructive schema generation)
- Initial data: loaded from `src/main/resources/figus/figus.json`
- Images stored as BLOBs in Imagen.contenido (@Lob field)

### File Uploads
- Max file size: 50MB (configured in `application.properties`)
- Image handling: TipoImagen enum controls image categories
- Controllers accept `MultipartFile` and pass to service for @Lob storage

## Integration Points

### Adding New Domain Features
1. Create entity extending `BaseEntity` in new module
2. Add `eliminado` boolean field on relationships
3. Generate Repository with soft-delete query: `findByIdAndEliminadoFalse(Long id)`
4. Create MapStruct Mapper (`@Mapper(componentModel = "spring")`)
5. Implement Service with `@Transactional` methods returning DTOs
6. Create REST Controller with `@RestController` and `@RequestMapping`
7. Protect endpoints with `@PreAuthorize("isAuthenticated()")`

### Security Requirements
- All entity-modifying endpoints require authenticated user
- Pass `@AuthenticationPrincipal CustomUserDetails` to service for audit
- Use `@PreAuthorize("hasAuthority(...)")` for role-based access
- Test with `SecurityMockMvcRequestPostProcessors` in tests

### Cross-Module Communication
- Services call other services (no circular dependencies)
- Repositories query only their own entity
- Mappers handle DTO conversion at service boundaries
- Use `@Transactional(readOnly = true)` for query-only methods

## Naming Conventions

- **Entities**: PascalCase (`Usuario`, `Figurita`, `Imagen`)
- **Join Tables**: `EntityEntity` pattern (`FiguritaUsuarioDuenio`)
- **DTOs**: Suffix with `Dto` (input) or `ViewDto` (output) (`UsuarioViewDto`)
- **Repositories**: `{Entity}Repository` extending `JpaRepository`
- **Services**: `{Entity}Service` with business logic
- **Mappers**: `{Entity}Mapper` (MapStruct interface)
- **Controllers**: `{Entity}Controller` with `@RestController` + `@RequestMapping("/{entity}")`

## Common Pitfalls to Avoid

1. **Soft-Delete Forgotten**: Every query must use `...AndEliminadoFalse()` pattern
2. **Missing @Transactional**: Service methods that modify data need this
3. **Returning Entities**: Always map to DTOs before returning from service/controller
4. **Password in Properties**: Secrets should use environment variables, not `application.properties`

