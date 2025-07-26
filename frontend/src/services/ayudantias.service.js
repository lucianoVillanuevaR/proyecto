import axios from '@services/root.service';

export const getAyudantias = async () => {
    try {
        const response = await axios.get('/ayudantias');
        return response.data.data;
    } catch (error) {
        console.error("Error consiguiendo las ayudantias:", error);
        throw error;
    }
}

export async function DeleteAyudantia(ayudantiaId){
    try {
        const response = await axios.delete(`/ayudantias/${ayudantiaId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la ayudantía:', error);
    }
}

export async function editayudantia(ayudantiaId, ayudantiaData) {
    try {
        const response = await axios.put(`/ayudantias/${ayudantiaId}`, ayudantiaData);
        return response.data;
    } catch (error) {
        console.error("Error editando la ayudantía:", error);
    }
}

export const createAyudantia = async (ayudantiaData) => {
    try {
        const response = await axios.post('/ayudantias', ayudantiaData);
        return response.data;
    } catch (error) {
        console.error("Error creando la ayudantia:", error);
        throw error;
    }
}

export const solicitarAyudantia = async (ayudantiaId) => {
    try {
        const response = await axios.post('/solicitudes', { ayudantiaId });
        return response.data;
    } catch (error) {
        console.error("Error solicitando la ayudantia:", error);
        throw error;
    }
}