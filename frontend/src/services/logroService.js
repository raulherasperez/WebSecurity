import axios from 'axios';

const API = 'http://localhost:8080/api/logros';

export const getLogrosDesbloqueados = async (token) =>
  axios.get(`${API}/usuario/desbloqueados`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

export const getLogrosPendientes = async (token) =>
  axios.get(`${API}/usuario/pendientes`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

export const desbloquearLogro = async (token, nombreLogro) =>
  axios.post(`${API}/usuario/desbloquear?nombreLogro=${encodeURIComponent(nombreLogro)}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data);

// Para admin: CRUD (puedes añadir más si lo necesitas)
export const getAllLogros = async (token) =>
  axios.get(API, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);