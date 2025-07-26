import { useState } from 'react'
import { createAyudantia } from '@services/ayudantias.service.js';    

export const useCreateAyudantia = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const createNewAyudantia = async (ayudantiaData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const data = await createAyudantia(ayudantiaData);
            setSuccess(true);
            return data;
        } catch (error) {
            console.error("Error creando la ayudantia:", error);
            setError(error.response?.data?.message || "Error al crear la ayudantía");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return { 
        createNewAyudantia, 
        loading, 
        error, 
        success, 
        resetState 
    };
}

export default useCreateAyudantia;
