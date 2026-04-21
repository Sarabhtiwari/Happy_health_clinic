import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/hhc/api/v1',
  withCredentials: true,
});

export default api;
