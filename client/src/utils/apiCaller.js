import axios from 'axios';
import backendUrlPrefix from './backendUrlPrefix.js';

const apiCaller = axios.create({
  baseURL: backendUrlPrefix,
});

export default apiCaller;