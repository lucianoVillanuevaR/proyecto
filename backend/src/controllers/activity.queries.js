import { AppDataSource } from '../config/configDb.js';
import { ActivityEntity } from '../entity/activity.entity.js';

// Obtener actividades del mes actual
export async function getMonthlyActivities() {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    // targetMonth es tipo Date, así que filtramos por mes y año
    const activities = await activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.createdBy', 'user')
        .where('EXTRACT(MONTH FROM activity.targetMonth) = :month', { month })
        .andWhere('EXTRACT(YEAR FROM activity.targetMonth) = :year', { year })
        .orderBy('activity.createdAt', 'DESC')
        .getMany();
    return activities;
}

// Obtener actividades en las que el usuario ha votado
export async function getMyVotedActivities(userId) {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    // Suponiendo que hay una relación votes (ManyToMany) con usuarios
    const activities = await activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.votes', 'vote')
        .leftJoinAndSelect('activity.createdBy', 'user')
        .where('vote.id = :userId', { userId })
        .orderBy('activity.createdAt', 'DESC')
        .getMany();
    return activities;
}
