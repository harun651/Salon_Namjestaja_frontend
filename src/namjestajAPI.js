import api from './api';

export const getNamjestaj = () => api.get('namjestaj/');
export const addNamjestaj = (data) => api.post('namjestaj/', data);
export const updateNamjestaj = (id, data) => api.put(`namjestaj/${id}/`, data);
export const deleteNamjestaj = (id) => api.delete(`namjestaj/${id}/`);
