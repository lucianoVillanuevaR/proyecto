import { useState } from 'react';

const ActivityCard = ({ activity, onVote, onRemoveVote, userRole, hasUserVoted }) => {
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async () => {
        setIsVoting(true);
        if (hasUserVoted) {
            await onRemoveVote(activity.id);
        } else {
            await onVote(activity.id);
        }
        setIsVoting(false);
    };


    const getStatusColor = (status) => {
        const colors = {
            'propuesta': '#ffd700',
            'seleccionada': '#4caf50',
            'organizada': '#2196f3',
            'completada': '#8bc34a',
            'rechazada': '#f44336'
        };
        return colors[status] || '#6c757d';
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'propuesta': return 'Propuesta';
            case 'seleccionada': return 'Seleccionada';
            case 'organizada': return 'Organizada';
            case 'completada': return 'Completada';
            case 'rechazada': return 'Rechazada';
            default: return status;
        }
    };

    const getPendingOrDone = (status) => {
        if (status === 'completada') return 'Hecha';
        if (status === 'rechazada') return 'Rechazada';
        return 'Pendiente';
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Fecha no valida';
        }
    };

    return (
        <div className="activity-card">
            <div className="activity-header">
                <h3>{activity.name}</h3>
                <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                    title={getPendingOrDone(activity.status)}
                >
                    {getStatusLabel(activity.status)}
                    {" "}
                    <small style={{fontWeight:400}}>
                        ({getPendingOrDone(activity.status)})
                    </small>
                </span>
            </div>
            
            <p className="activity-description">{activity.description}</p>
            
            <div className="activity-info">
                <div className="info-item">
                    <strong>Tipo:</strong> {activity.type}
                </div>
                <div className="info-item">
                    <strong>Votos:</strong> {activity.votesCount || 0}
                </div>
                <div className="info-item">
                    <strong>Mes objetivo:</strong> {formatDate(activity.targetMonth)}
                </div>
                {activity.createdBy && (
                    <div className="info-item">
                        <strong>Propuesto por:</strong> {
                            activity.isAdminActivity ? 'Administrador' : 
                            (activity.createdBy.name || activity.createdBy.username || 'Usuario')
                        }
                    </div>
                )}
            </div>

            <div className="activity-actions">
                {activity.status === 'propuesta' && (
                    <button 
                        onClick={handleVote}
                        disabled={isVoting || hasUserVoted}
                        className={`vote-btn ${hasUserVoted ? 'voted' : 'not-voted'}`}
                        title={hasUserVoted ? 'Solo puedes votar una vez por actividad' : ''}
                    >
                        {isVoting ? 'Procesando...' : 
                        hasUserVoted ? 'Ya votaste' : '👍 Votar'}
                    </button>
                )}

                {userRole === 'administrador' && activity.status === 'seleccionada' && (
                    <button 
                        className="organize-btn"
                        onClick={() => {
                            alert(`Organizar actividad: ${activity.name}\n\n(Esta funcionalidad se puede implementar después)`);
                        }}
                    >
                        📋 Organizar
                    </button>
                )}

                {userRole === 'administrador' && activity.status === 'propuesta' && activity.votesCount >= 3 && (
                    <button 
                        className="organize-btn"
                        onClick={() => {
                            alert(`Seleccionar actividad: ${activity.name}\n\n(Esta funcionalidad se puede implementar después)`);
                        }}
                    >
                        ✅ Seleccionar
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActivityCard;