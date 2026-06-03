import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken, clearAuthToken, login as apiLogin, signup as apiSignup, getMe } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const stored = await AsyncStorage.getItem("auth");
      if (stored) {
        const { token, userId } = JSON.parse(stored);
        setAuthToken(token);
        // Verify token is still valid
        await getMe();
        setUser({ id: userId, token });
      }
    } catch {
      await AsyncStorage.removeItem("auth");
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    const data = await apiLogin(username, password);
    const token = data.token.value;
    const userId = data.user.userId;
    setAuthToken(token);
    await AsyncStorage.setItem("auth", JSON.stringify({ token, userId }));
    setUser({ id: userId, token });
  }

  async function signup(username, password, passwordConfirm, latitude, longitude) {
    const data = await apiSignup(username, password, passwordConfirm, latitude, longitude);
    console.log("signup response:", JSON.stringify(data));
    const token = data.token.value;
    const userId = data.user.userId;
    setAuthToken(token);
    await AsyncStorage.setItem("auth", JSON.stringify({ token, userId }));
    setUser({ id: userId, token });
  }

  async function logout() {
    clearAuthToken();
    await AsyncStorage.removeItem("auth");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
