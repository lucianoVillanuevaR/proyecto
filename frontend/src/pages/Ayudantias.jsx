import '@styles/Ayudantias.css';
import useGetAyudantias from '@hooks/Ayudantias/useGetAyudantias.jsx';
import useDeleteAyudantia from '@hooks/Ayudantias/useDeleteAyudantia.jsx';
import useSolicitarAyudantia from '../hooks/Ayudantias/useSolicitarAyudantia.jsx';
import useEditAyudantia from '@hooks/Ayudantias/useEditAyudantia.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Ayudantias = () => {
  const { ayudantias, fetchAyudantias } = useGetAyudantias();
  const { handleDeleteAyudantia } = useDeleteAyudantia(fetchAyudantias);
  const { handleEditAyudantia } = useEditAyudantia(fetchAyudantias);
  const { solicitar, loading: solicitando, error, success, message, resetState } = useSolicitarAyudantia();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAyudantias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        resetState();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, resetState]);

  const handleSolicitar = async (ayudantiaId, asignatura) => {
    const confirmar = window.confirm(`¿Estás seguro que deseas solicitar la ayudantía de ${asignatura}?`);
    
    if (confirmar) {
      try {
        await solicitar(ayudantiaId);
        // Refrescar la lista para mostrar cambios actualizados
        fetchAyudantias();
      } catch (error) {
        console.error('Error al solicitar ayudantía:', error);
      }
    }
  };

  return (
      <div className="Ayudantias-page">
        {/* Mensajes de respuesta */}
        {message && (
          <div className={`message ${error ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        )}
        
        <div className="ayudantias-header">
          <h2>Lista de Ayudantias</h2>
          <button 
            className="btn-create"
            onClick={() => navigate('/ayudantias/create')}
          >
            + Crear Nueva Ayudantía
          </button>
        </div>
        <table className="ayudantias-table">
            <thead>
                <tr>
                    
                    <th>Asignatura</th>
                    <th>Descripción</th>
                    <th>Cupos Totales</th>
                    <th>Profesor Disponible</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(ayudantias) && ayudantias.length > 0 ? (
                    ayudantias.map((ayudantia) => (
                        <tr key={ayudantia.id}>
                            <td>{ayudantia.asignatura}</td>
                            <td>{ayudantia.descripcion}</td>
                            <td>{ayudantia.cupo}</td>
                            <td>{ayudantia.hayprofesor ? 'Sí' : 'No'}</td>
                            <td>
                                <button className="edit" onClick={() => handleEditAyudantia(ayudantia.id, ayudantia)}>Editar</button>
                                <button className="delete" onClick={() => handleDeleteAyudantia(ayudantia.id)}>Eliminar</button>
                                <button
                                    className="solicitar"
                                    onClick={() => handleSolicitar(ayudantia.id, ayudantia.asignatura)}
                                    disabled={solicitando}
                                >
                                    {solicitando ? 'Solicitando...' : 'Solicitar'}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No hay ayudantías disponibles</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  );
};

export default Ayudantias;
