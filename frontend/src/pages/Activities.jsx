import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ProposeActivityForm from '../components/proposeActivityForm';
import ActivityCard from '../components/ActivityCard';
import { 
    getMonthlyActivities, 
    proposeActivity, 
    voteActivity, 
    removeVote 
} from '../services/activity.service';
import Swal from 'sweetalert2';
import '../styles/Activities.css';

const Activities = () => {
    const { user } = useAuth();
    const [monthlyActivities, setMonthlyActivities] = useState([]);
    // const [myVotes, setMyVotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const monthlyData = await getMonthlyActivities();
            if (monthlyData.status === 'success') {
                setMonthlyActivities(monthlyData.data || []);
            }
        } catch {
            Swal.fire('Error', 'Error al cargar datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleProposeActivity = async (activityData) => {
        try {
            const response = await proposeActivity(activityData);
            if (response.status === 'success') {
                Swal.fire('¡Éxito!', 'Actividad propuesta correctamente', 'success');
                setShowForm(false);
                await loadData();
            } else {
                Swal.fire('Error', response.message || 'Error al proponer actividad', 'error');
            }
        } catch {
            Swal.fire('Error', 'Error al proponer actividad', 'error');
        }
    };

    const handleVote = async (activityId) => {
        try {
            const response = await voteActivity(activityId);
            if (response && response.status === 'success') {
                Swal.fire('¡Voto registrado!', '', 'success');
                await loadData();
            } else {
                Swal.fire('Error', response?.message || 'Error al votar', 'error');
            }
        } catch {
            Swal.fire('Error', 'Error al votar', 'error');
        }
    };

    const handleRemoveVote = async (activityId) => {
        try {
            const response = await removeVote(activityId);
            if (response.status === 'success') {
                Swal.fire('Voto removido', '', 'info');
                await loadData();
            } else {
                Swal.fire('Error', response.message || 'Error al quitar voto', 'error');
            }
        } catch {
            Swal.fire('Error', 'Error al quitar voto', 'error');
        }
    };

    const hasUserVoted = (activity) => {
        if (!activity.votedEmails || !Array.isArray(activity.votedEmails)) return false;
        return activity.votedEmails.includes(user?.email);
    };

    if (loading) {
        return (
            <div className="activities-page">
                <div className="loading">Cargando actividades...</div>
            </div>
        );
    }

    return (
        <div className="activities-page">
            <div className="activities-header">
                <h1>🎯 Actividades del Mes</h1>
                <button 
                    className="propose-btn"
                    onClick={() => setShowForm(true)}
                >
                    ➕ Proponer Nueva Actividad
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ProposeActivityForm 
                            onSubmit={handleProposeActivity}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            <div className="activities-content">
                {monthlyActivities.length === 0 ? (
                    <div className="no-activities">
                        <h3> No hay actividades para este mes</h3>
                        <p>¡Sé el primero en proponer una actividad!</p>
                    </div>
                ) : (
                    <div className="activities-grid">
                        {monthlyActivities.map(activity => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onVote={handleVote}
                                onRemoveVote={handleRemoveVote}
                                userRole={user?.role || 'usuario'}
                                hasUserVoted={hasUserVoted(activity)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activities;