import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // Estado de inicialización

  useEffect(() => {
    // Este efecto se ejecuta solo una vez al cargar la aplicación
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({ email: decodedUser.sub, role: decodedUser.role });
        }
      } else {
        setUser(null);
      }
    } catch {
      // Si hay cualquier error, aseguramos un estado limpio
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      // Cuando terminamos, marcamos la inicialización como completa
      setIsInitializing(false);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decodedUser = jwtDecode(newToken);
    setUser({ email: decodedUser.sub, role: decodedUser.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // El valor del contexto ahora incluye 'isInitializing'
  const value = { user, isInitializing, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {/* ¡LA MAGIA! No renderizamos el resto de la app hasta que la carga inicial termine */}
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};

// Dejamos el hook aquí como pediste
export const useAuth = () => {
  return useContext(AuthContext);
};
