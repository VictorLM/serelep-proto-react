import axios from 'axios';

let baseURL = '';

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://api.avincerstudio.com';
} else if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3001';
}

export const api = axios.create({
  baseURL,
});
