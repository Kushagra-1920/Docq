import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (originalConfig.url !== '/auth/login' && error.response) {
      // Access Token was expired
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          const rs = await axios.post('http://localhost:8080/api/auth/refresh', {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = rs.data;

          useAuthStore.getState().setTokens(accessToken, newRefreshToken);

          return api(originalConfig);
        } catch (_error) {
          useAuthStore.getState().logout();
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
