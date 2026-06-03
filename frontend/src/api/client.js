const BASE_URL = "http://192.168.1.36:8080"; // Android emulator → localhost
// Para dispositivo físico, cambiar a la IP de tu máquina, ej: http://192.168.1.X:8080

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const errData = await res.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Auth
export const login = (username, password) =>
  request("POST", "/api/auth/login", { username, password });

export const signup = (username, password, passwordConfirm, latitude, longitude) =>
  request("POST", "/api/auth/signup", { username, password, passwordConfirm, latitude, longitude });

export const getMe = () => request("GET", "/api/auth/me");

// Figuritas
export const getMyFiguritas = () => request("GET", "/api/me/figuritas");

export const updateFiguritaStatus = (figuritaId, owned, wanted) =>
  request("PATCH", `/api/me/figuritas/${figuritaId}`, { owned, wanted });

// Matches
export const getMatches = () => request("GET", "/api/me/matches");

export const getUserMatch = (userId) => request("GET", `/api/me/matches/${userId}`);

// Position
export const updatePosition = (latitude, longitude) =>
  request("PATCH", "/api/me/position", { latitude, longitude });



export async function fetchImageAsBase64(imagenId) {
  try {
    const res = await fetch(`${BASE_URL}/api/imagenes/${imagenId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

