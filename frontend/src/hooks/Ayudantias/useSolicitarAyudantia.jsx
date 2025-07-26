import { useState } from 'react'
import { solicitarAyudantia } from '@services/ayudantias.service.js';    

export const useSolicitarAyudantia = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    
    const solicitar = async (ayudantiaId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            setMessage('');
            
            const response = await solicitarAyudantia(ayudantiaId);
            setSuccess(true);
            setMessage(response.message || "¡Solicitud enviada exitosamente!");
            return response;
        } catch (error) {
            console.error("Error solicitando la ayudantia:", error);
            setError(error.response?.data?.message || "Error al solicitar la ayudantía");
            setMessage(error.response?.data?.message || "Error al solicitar la ayudantía");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
        setMessage('');
    };

    return { 
        solicitar, 
        loading, 
        error, 
        success, 
        message,
        resetState 
    };
}

export default useSolicitarAyudantia;
