import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateAyudantia from '../hooks/Ayudantias/useCreateAyudantia.jsx';
import '@styles/CreateAyudantia.css';

const CreateAyudantia = () => {
  const navigate = useNavigate();
  const { createNewAyudantia, loading, error, success, resetState } = useCreateAyudantia();
  
  const [formData, setFormData] = useState({
    asignatura: '',
    descripcion: '',
    cupo: '',
    hayprofesor: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createNewAyudantia({
        ...formData,
        cupo: parseInt(formData.cupo) // Convertir a número
      });
    } catch (error) {
      console.error('Error al crear ayudantía:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      asignatura: '',
      descripcion: '',
      cupo: '',
      hayprofesor: false
    });
    resetState();
  };

  // Redirigir después de crear exitosamente
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/ayudantias');
      }, 2000);
    }
  }, [success, navigate]);

  return (
    <div className="create-ayudantia-page">
      <div className="create-ayudantia-container">
        <h2>Crear Nueva Ayudantía</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            ¡Ayudantía creada exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-ayudantia-form">
          <div className="form-group">
            <label htmlFor="asignatura">Asignatura:</label>
            <input
              type="text"
              id="asignatura"
              name="asignatura"
              value={formData.asignatura}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cupo">Cupos:</label>
            <input
              type="number"
              id="cupo"
              name="cupo"
              value={formData.cupo}
              onChange={handleInputChange}
              required
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hayprofesor"
                checked={formData.hayprofesor}
                onChange={handleInputChange}
                disabled={loading}
              />
              Hay profesor disponible
            </label>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Ayudantía'}
            </button>
            
            <button 
              type="button" 
              className="btn-reset"
              onClick={handleReset}
              disabled={loading}
            >
              Limpiar
            </button>
            
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/ayudantias')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAyudantia;
