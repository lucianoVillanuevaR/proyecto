import { DeleteAyudantia } from '@services/ayudantias.service.js';
import Swal from 'sweetalert2';

export const useDeleteAyudantia = (fetchAyudantias) => {
    const handleDeleteAyudantia = async (ayudantiaId) => {
        try {
            const response = await DeleteAyudantia(ayudantiaId);
            if (response) {
                Swal.fire({
                    title: 'Ayudantía eliminada',
                    text: 'La ayudantía ha sido eliminada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                await fetchAyudantias();
            }
        } catch (error) {
            console.error('Error al eliminar la ayudantía:', error);
        }
    };
    return { handleDeleteAyudantia };
};

export default useDeleteAyudantia;