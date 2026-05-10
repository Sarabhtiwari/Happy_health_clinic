import axios from 'axios';
import useAuthStore from "../zustand/UseAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
//to handle ghost login problem if any request gives 401 response means expired hai so clear Auth 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      useAuthStore.getState().clearAuth(); 
    }
    return Promise.reject(error);
  }
);
export default api;
