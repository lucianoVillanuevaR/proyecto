import axios from './root.service.js';

export const getMonthlyActivities = async () => {
    try {
        const response = await axios.get('/activities/monthly');
        // Tu backend devuelve directamente el array
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al obtener actividades'
        };
    }
};

export const getMyActivities = async () => {
    try {
        const response = await axios.get('/activities/my-votes');
        // Tu backend devuelve { totalActivities, activities }
        return {
            status: 'success',
            data: response.data.activities.map(activity => ({
                activityId: activity.id,  // Convertir id a activityId
                ...activity
            }))
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al obtener mis actividades'
        };
    }
};

export const proposeActivity = async (activityData) => {
    try {
        const response = await axios.post('/activities/propose', activityData);
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al proponer actividad'
        };
    }
};

export const voteActivity = async (activityId) => {
    try {
        const response = await axios.post(`/activities/${activityId}/vote`);
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al votar'
        };
    }
};

export const removeVote = async (activityId) => {
    try {
        const response = await axios.delete(`/activities/${activityId}/vote`);
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al quitar voto'
        };
    }
};

// Funciones adicionales que tienes en el backend
export const organizeActivity = async (activityId, organizationData) => {
    try {
        const response = await axios.post(`/activities/${activityId}/organize`, organizationData);
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al organizar actividad'
        };
    }
};

export const selectMonthlyActivities = async (selectionData) => {
    try {
        const response = await axios.post('/activities/select-monthly', selectionData);
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al seleccionar actividades'
        };
    }
};

export const getActivityStats = async () => {
    try {
        const response = await axios.get('/activities/stats');
        return {
            status: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.response?.data?.message || 'Error al obtener estadísticas'
        };
    }
};