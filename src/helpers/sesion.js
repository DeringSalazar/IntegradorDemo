import customAxios from './customAxios'; // Importa tu axios personalizado
import axios from 'axios'; // Para peticiones sin interceptores (login, registro)

const BASE_URL = "https://backendapi-production-bf1d.up.railway.app/api";

const login = async (correo, contrasena) => {
  try {
    // Usar axios directo para login (sin interceptores)
    const res = await axios.post(
      `${BASE_URL}/auth/login`,
      { correo, contrasena },
      { withCredentials: true } // Importante para recibir la cookie del refresh token
    );

    // El backend devuelve: { success, accessToken, usuario }
    const { accessToken, usuario } = res.data;
    
    if (!usuario) {
      throw new Error("No se recibió información de usuario");
    }
    
    if (!usuario.id) {
      throw new Error("No se recibió el ID del usuario");
    }
    
    if (!accessToken) {
      throw new Error("No se recibió un token de autenticación");
    }

    // Guardar access token y datos del usuario
    // El refresh token se maneja automáticamente via cookies httpOnly
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("idUsuario", usuario.id.toString());

    console.log('✅ Login exitoso para:', usuario.nombreUsuario);
    return { accessToken, usuario };

  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || "Error al iniciar sesión");
  }
};

const logout = async () => {
  try {
    // Llamar al endpoint de logout para revocar el refresh token
    await customAxios.post("/auth/logout");
    console.log('✅ Logout exitoso en el servidor');
  } catch (error) {
    console.error("⚠️ Error al cerrar sesión en el servidor:", error);
    // Continuar con logout local aunque falle el del servidor
  } finally {
    // Limpiar datos locales
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("idUsuario");
    
    console.log('🧹 Datos locales limpiados');
  }
};

// Función para obtener datos del usuario desde localStorage
const getCurrentUser = () => {
  try {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  const usuario = getCurrentUser();
  return !!(accessToken && usuario);
};

// Función para obtener el token actual
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Función para validar el token actual
const validateToken = async () => {
  try {
    const response = await customAxios.get("/auth/validate");
    return response.data;
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};

// ==================== FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA ====================

// Función para validar email (sin token requerido)
const validateEmail = async (correo) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/validate-email`,
      { correo },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error validando email:", error);
    throw new Error(error.response?.data?.error || "Error validando email");
  }
};

// Función para cambiar contraseña con código (sin token requerido)
const changePasswordWithCode = async (correo, codigo, nuevaContrasena) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/change-password`,
      { correo, codigo, nuevaContrasena },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    throw new Error(error.response?.data?.error || "Error cambiando contraseña");
  }
};

// ==================== FUNCIONES DE GESTIÓN DE SESIONES ====================

// Función para obtener sesiones activas (requiere token)
const getUserSessions = async () => {
  try {
    const response = await customAxios.get("/auth/sessions");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo sesiones:", error);
    throw new Error(error.response?.data?.error || "Error obteniendo sesiones");
  }
};

// Función para revocar una sesión específica (requiere token)
const revokeSession = async (sessionId) => {
  try {
    const response = await customAxios.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error revocando sesión:", error);
    throw new Error(error.response?.data?.error || "Error revocando sesión");
  }
};

// Función para revocar todas las otras sesiones (requiere token)
const revokeAllOtherSessions = async () => {
  try {
    const response = await customAxios.post("/auth/revoke-all-sessions");
    return response.data;
  } catch (error) {
    console.error("Error revocando sesiones:", error);
    throw new Error(error.response?.data?.error || "Error revocando sesiones");
  }
};

// Exportar todas las funciones
export default {
  // Funciones básicas
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAccessToken,
  validateToken,
  
  // Recuperación de contraseña
  validateEmail,
  changePasswordWithCode,
  
  // Gestión de sesiones
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  
  // Axios personalizado para otras peticiones
  customAxios,
};

// También exportar funciones individuales
export {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAccessToken,
  validateToken,
  validateEmail,
  changePasswordWithCode,
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  customAxios,
};