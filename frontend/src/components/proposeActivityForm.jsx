import { useForm } from 'react-hook-form';
import { useState } from 'react';

const ProposeActivityForm = ({ onSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activityTypes = [
        { value: 'taller', label: 'Taller' },
        { value: 'torneo', label: 'Torneo' },
        { value: 'charla', label: 'Charla' },
        { value: 'otro', label: 'Otro' }
    ];

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        await onSubmit(data);
        setIsSubmitting(false);
    };

    return (
        <div className="propose-form-container">
            <h2>Proponer Nueva Actividad</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="form-group">
                    <label>Nombre de la actividad:</label>
                    <input 
                        type="text"
                        {...register('name', { required: 'El nombre es obligatorio' })}
                    />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea 
                        rows="4"
                        {...register('description', { required: 'La descripción es obligatoria' })}
                    />
                    {errors.description && <span className="error">{errors.description.message}</span>}
                </div>

                <div className="form-group">
                    <label>Tipo:</label>
                    <select {...register('type', { required: 'Selecciona un tipo' })}>
                        <option value="">Seleccionar...</option>
                        {activityTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.type && <span className="error">{errors.type.message}</span>}
                </div>

                <div className="form-group">
                    <label>Mes objetivo:</label>
                    <input 
                        type="date"
                        {...register('targetMonth', { required: 'La fecha es obligatoria' })}
                    />
                    {errors.targetMonth && <span className="error">{errors.targetMonth.message}</span>}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel}>Cancelar</button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Proponer Actividad'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProposeActivityForm;