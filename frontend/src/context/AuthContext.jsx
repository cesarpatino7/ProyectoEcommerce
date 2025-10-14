import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { userService } from "../api/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // Estado de inicialización

  useEffect(() => {
    // Este efecto se ejecuta solo una vez al cargar la aplicación
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedUser = jwtDecode(token);
          if (decodedUser.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setUser(null);
          } else {
            // Cargar el perfil completo del usuario
            try {
              const profile = await userService.getMyProfile();
              setUser({
                email: decodedUser.sub,
                role: decodedUser.role,
                nombre: profile.nombre,
                apellido: profile.apellido,
                telefono: profile.telefono,
                id: profile.id,
              });
            } catch (error) {
              // Si falla la carga del perfil, usar solo los datos del token
              console.error("Error al cargar perfil:", error);
              setUser({ email: decodedUser.sub, role: decodedUser.role });
            }
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
    };

    initializeAuth();
  }, []);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    const decodedUser = jwtDecode(newToken);

    // Intentar cargar el perfil completo
    try {
      const profile = await userService.getMyProfile();
      setUser({
        email: decodedUser.sub,
        role: decodedUser.role,
        nombre: profile.nombre,
        apellido: profile.apellido,
        telefono: profile.telefono,
        id: profile.id,
      });
    } catch (error) {
      // Si falla, usar solo los datos del token
      console.error("Error al cargar perfil en login:", error);
      setUser({ email: decodedUser.sub, role: decodedUser.role });
    }
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
