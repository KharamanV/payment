import axios from 'axios';

axios.interceptors.request.use(config => ({
  ...config,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
  },
}), err => Promise.reject(err));

export default axios;
