# App de intercambio de figuritas

## Como ejecutar el backend

En el directorio `backend/`, ejecutar `./mvnw spring-boot:run`. El backend se ejecuta en el puerto 8080.

## Endpoints disponibles

Para más detalle, ver los DTOs que recibe / retorna cada endpoint en el código fuente del backend.

### Autenticación
* **POST `/api/auth/login`**: Inicia sesión.
  * **Input**: `username`, `password`
  * **Output**: Token de acceso y ID del usuario.
* **POST `/api/auth/signup`**: Registra un nuevo usuario.
  * **Input**: `username`, `password`, `passwordConfirm`, `latitude`, `longitude`
  * **Output**: Token de acceso y ID del usuario.
* **GET `/api/auth/me`**: Verifica el estado de la sesión.
  * **Output**: ID del usuario autenticado.

### Figuritas
* **GET `/api/me/figuritas`**: Obtiene la colección del usuario actual.
  * **Output**: Lista de figuritas con su estado (poseída/buscada).
* **PATCH `/api/me/figuritas/{figuritaId}`**: Actualiza si el usuario tiene o quiere una figurita.
  * **Input**: `owned` (boolean), `wanted` (boolean)

### Matches e Intercambio
* **GET `/api/me/matches`**: Lista usuarios cercanos que tienen figuritas que el usuario busca (y viceversa).
  * **Output**: Lista de usuarios con sus figuritas coincidentes.
* **GET `/api/me/matches/{userId}`**: Obtiene el detalle de match con un usuario específico.
  * **Output**: Datos del usuario y lista de figuritas para intercambiar.

### Usuario e Imágenes
* **PATCH `/api/me/position`**: Actualiza la ubicación del usuario.
  * **Input**: `latitude`, `longitude`
* **GET `/api/imagenes/{imagenId}`**: Descarga una imagen (figurita o avatar).
  * **Output**: Archivo binario (image/png).