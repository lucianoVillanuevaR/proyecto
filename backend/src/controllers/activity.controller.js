import { ActivityEntity } from '../entity/activity.entity.js';
import { AppDataSource } from '../config/configDb.js';
import * as activityQueries from './activity.queries.js';

const activityController = {
    // Obtener actividades del mes actual
    getMonthlyActivities: async (req, res) => {
        try {
            const activities = await activityQueries.getMonthlyActivities();
            res.json(activities);
        } catch (error) {
            console.error('Error al obtener actividades del mes:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener actividades en las que el usuario ha votado
    getMyVotedActivities: async (req, res) => {
        try {
            const userId = req.user.id;
            const activities = await activityQueries.getMyVotedActivities(userId);
            res.json({ activities });
        } catch (error) {
            console.error('Error al obtener actividades votadas:', error);
            res.status(500).json({ message: error.message });
        }
    },
    // Vote for an activity (by email)
    voteActivity: async (req, res) => {
        try {
            const activityId = parseInt(req.params.id);
            const userEmail = req.user.email;

            const activityRepository = AppDataSource.getRepository(ActivityEntity);
            // Check if activity exists
            const activity = await activityRepository
                .createQueryBuilder('activity')
                .where('activity.id = :id', { id: activityId })
                .getOne();

            if (!activity) {
                return res.status(404).json({ message: 'Actividad no encontrada' });
            }

            // Inicializar array si no existe
            if (!activity.votedEmails) activity.votedEmails = [];

            // Check if already voted by email
            if (activity.votedEmails.includes(userEmail)) {
                return res.status(400).json({ message: 'Ya has votado por esta actividad' });
            }

            // Add email to votedEmails and update count
            activity.votedEmails.push(userEmail);
            activity.votesCount = (activity.votesCount || 0) + 1;
            await activityRepository.save(activity);

            res.json({ message: 'Voto registrado exitosamente' });
        } catch (error) {
            console.error('Error al votar:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Remove vote from an activity (by email)
    removeVote: async (req, res) => {
        try {
            const activityId = parseInt(req.params.id);
            const userEmail = req.user.email;

            const activityRepository = AppDataSource.getRepository(ActivityEntity);
            // Check if activity exists
            const activity = await activityRepository
                .createQueryBuilder('activity')
                .where('activity.id = :id', { id: activityId })
                .getOne();

            if (!activity) {
                return res.status(404).json({ message: 'Actividad no encontrada' });
            }

            if (!activity.votedEmails) activity.votedEmails = [];

            // Check if vote exists by email
            if (!activity.votedEmails.includes(userEmail)) {
                return res.status(400).json({ message: 'No has votado por esta actividad' });
            }

            // Remove email from votedEmails and update count
            activity.votedEmails = activity.votedEmails.filter(email => email !== userEmail);
            activity.votesCount = Math.max((activity.votesCount || 1) - 1, 0);
            await activityRepository.save(activity);

            res.json({ message: 'Voto removido exitosamente' });
        } catch (error) {
            console.error('Error al remover voto:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new activity proposal
    createActivity: async (req, res) => {
        try {
            const { name, description, type, targetMonth } = req.body;
            
            if (!name || !description || !type || !targetMonth) {
                return res.status(400).json({ 
                    message: 'Se requieren nombre, descripción, tipo y mes objetivo de la actividad' 
                });
            }

            const activityRepository = AppDataSource.getRepository(ActivityEntity);
            
            const result = await activityRepository
                .createQueryBuilder()
                .insert()
                .into(ActivityEntity)
                .values({
                    name: name,
                    description: description,
                    type: type,
                    targetMonth: new Date(targetMonth),
                    createdBy: { id: req.user.id },
                    votesCount: 0,
                    status: "propuesta"
                })
                .execute();

            const activity = await activityRepository
                .createQueryBuilder('activity')
                .leftJoinAndSelect('activity.createdBy', 'user')
                .where('activity.id = :id', { id: result.identifiers[0].id })
                .getOne();
            
            res.status(201).json(activity);
        } catch (error) {
            console.error('Error al crear actividad:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Organize selected activity (admin only)
    organizeActivity: async (req, res) => {
        try {
            const activityId = parseInt(req.params.id);
            const { date, location, capacity, additionalInfo } = req.body;

            if (!date || !location || !capacity) {
                return res.status(400).json({ 
                    message: 'Se requieren fecha, ubicación y capacidad' 
                });
            }

            const activityRepository = AppDataSource.getRepository(ActivityEntity);
            
            const activity = await activityRepository
                .createQueryBuilder('activity')
                .where('activity.id = :id', { id: activityId })
                .getOne();

            if (!activity) {
                return res.status(404).json({ message: 'Actividad no encontrada' });
            }

            await activityRepository
                .createQueryBuilder()
                .update(ActivityEntity)
                .set({
                    status: 'organizada',
                    organizationDetails: {
                        date: new Date(date),
                        location,
                        capacity: parseInt(capacity),
                        additionalInfo: additionalInfo || ''
                    }
                })
                .where('id = :id', { id: activityId })
                .execute();

            const updatedActivity = await activityRepository
                .createQueryBuilder('activity')
                .where('activity.id = :id', { id: activityId })
                .getOne();

            res.json({
                message: 'Actividad organizada exitosamente',
                activity: updatedActivity
            });
        } catch (error) {
            console.error('Error al organizar actividad:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Select activities for the month (admin only)
    selectActivitiesForMonth: async (req, res) => {
        try {
            let { month, year, limit = 5 } = req.query;
            
            month = parseInt(month);
            year = parseInt(year);
            limit = parseInt(limit);

            if (isNaN(month) || isNaN(year)) {
                return res.status(400).json({ 
                    message: 'Se requieren mes y año válidos' 
                });
            }

            const activityRepository = AppDataSource.getRepository(ActivityEntity);

            const activities = await activityRepository
                .createQueryBuilder('activity')
                .leftJoinAndSelect('activity.createdBy', 'creator')
                .where('EXTRACT(MONTH FROM activity.targetMonth) = :month', { month })
                .andWhere('EXTRACT(YEAR FROM activity.targetMonth) = :year', { year })
                .andWhere('activity.status = :status', { status: 'propuesta' })
                .orderBy('activity.votesCount', 'DESC')
                .take(limit)
                .getMany();

            if (activities.length === 0) {
                return res.status(404).json({ 
                    message: 'No hay actividades propuestas para este mes' 
                });
            }

            const updatedActivities = [];
            for (const activity of activities) {
                await activityRepository
                    .createQueryBuilder()
                    .update(ActivityEntity)
                    .set({ status: 'seleccionada' })
                    .where('id = :id', { id: activity.id })
                    .execute();

                updatedActivities.push({
                    id: activity.id,
                    name: activity.name,
                    votesCount: activity.votesCount,
                    createdBy: activity.createdBy?.username || 'Sistema'
                });
            }

            res.json({
                message: 'Actividades seleccionadas exitosamente',
                month,
                year,
                selectedActivities: updatedActivities
            });
        } catch (error) {
            console.error('Error al seleccionar actividades:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get activity statistics (admin only)
    getActivityStats: async (req, res) => {
        try {
            const activityRepository = AppDataSource.getRepository(ActivityEntity);

            // Get total activities count
            const totalActivities = await activityRepository
                .createQueryBuilder('activity')
                .getCount();

            // Get statistics by status
            const stats = await activityRepository
                .createQueryBuilder('activity')
                .select([
                    'activity.status',
                    'COUNT(activity.id) as count',
                    'SUM(activity.votesCount) as totalVotes'
                ])
                .groupBy('activity.status')
                .getRawMany();

            // Get top voted activities
            const topVoted = await activityRepository
                .createQueryBuilder('activity')
                .leftJoinAndSelect('activity.createdBy', 'creator')
                .select([
                    'activity.id',
                    'activity.name',
                    'activity.votesCount',
                    'activity.status',
                    'creator.username'
                ])
                .orderBy('activity.votesCount', 'DESC')
                .take(5)
                .getMany();

            res.json({
                totalActivities,
                statsByStatus: stats.map(s => ({
                    status: s.activity_status,
                    count: parseInt(s.count),
                    totalVotes: parseInt(s.totalVotes) || 0
                })),
                topVotedActivities: topVoted.map(a => ({
                    id: a.id,
                    name: a.name,
                    votesCount: a.votesCount,
                    status: a.status,
                    createdBy: a.createdBy?.username || 'Sistema'
                }))
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

export default activityController;
