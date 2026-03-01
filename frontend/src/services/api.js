import axios from 'axios';

const api = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* =========================
   PEDIDOS
========================= */
export const sendOrder = (orderData) => {
    return api.post('/orders', orderData);
};

/* =========================
   ORÇAMENTOS
========================= */
export const sendQuote = (data) => {
    return api.post('/quotes', data);
};

/* =========================
   CADASTRO
========================= */
export const registerUser = (data) => {
    return api.post('/login/users', data);
};

/* =========================
   LOGIN
========================= */
export const loginUser = (data) => {
    return api.post('/login/sessions', data);
};

/* =========================
   ADMIN - PRODUTOS
========================= */
export const createProduct = (formData) => {
    return api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updateProduct = (id, formData) => {
    const hasImage = formData.get('image') instanceof File;
    if (!hasImage) {
        const data = {
            name: formData.get('name'),
            category: formData.get('category') || null,
            description: formData.get('description') || null,
        };
        return api.put(`/products/${id}`, data);
    }
    return api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};

export default api;
