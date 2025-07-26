import { useState } from 'react'
import { getAyudantias } from '@services/ayudantias.service.js';    

export const useGetAyudantias = () => {
    const [ayudantias, setAyudantias] = useState([]);
    
    const fetchAyudantias = async () => {
        try {
            const data = await getAyudantias();
            setAyudantias(data);
        } catch (error) {
            console.error("Error consiguiendo las ayudantias:", error);
        }
    };

    return { ayudantias, setAyudantias, fetchAyudantias };
}

export default useGetAyudantias;