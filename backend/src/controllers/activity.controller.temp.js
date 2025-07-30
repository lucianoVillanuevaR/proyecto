import { ActivityEntity } from '../entity/activity.entity.js';
import { AppDataSource } from '../config/configDb.js';

const activityController = {
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
