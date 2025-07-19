import axios from "axios";

const BASE_URL = "https://backendapi-production-bf1d.up.railway.app/api";

const customAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // IMPORTANTE: Habilita cookies automáticas
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar access token automáticamente
customAxios.interceptors.request.use(
  (config) => {
    // Cambié de "token" a "accessToken" para ser más específico
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar renovación automática de tokens
customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró (401) y no hemos intentado renovarlo ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Access token expirado, renovando...');
        
        // Intentar renovar el token usando el refresh token (cookie httpOnly)
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true } // Envía la cookie del refresh token
        );

        const { accessToken } = refreshResponse.data;
        
        if (accessToken) {
          console.log('✅ Access token renovado exitosamente');
          
          // Guardar el nuevo access token
          localStorage.setItem('accessToken', accessToken);
          
          // Actualizar el header de la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Reintentar la petición original
          return customAxios(originalRequest);
        }

      } catch (refreshError) {
        console.error('❌ Error renovando token:', refreshError);
        
        // Si falla la renovación, limpiar datos y redirigir
        localStorage.removeItem('accessToken');
        localStorage.removeItem('usuario');
        localStorage.removeItem('idUsuario');
        
        // Opcional: Mostrar notificación al usuario
        console.log('🚪 Sesión expirada, redirigiendo al login...');
        
        // Redirigir al login (ajusta según tu routing)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default customAxios;