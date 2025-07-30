import { Router } from 'express';
const router = Router();
import activityController from '../controllers/activity.controller.js';
import { authenticateJwt } from '../middleware/authentication.middleware.js';
import { isAdmin } from '../middleware/authorization.middleware.js';

// Rutas de votación (para usuarios autenticados)
router.post('/:id/vote', authenticateJwt, activityController.voteActivity);
router.delete('/:id/vote', authenticateJwt, activityController.removeVote);

// Crear propuesta de actividad (para usuarios autenticados)
router.post('/propose', authenticateJwt, activityController.createActivity);

// Rutas para administradores

// NUEVAS RUTAS PARA ACTIVIDADES DEL MES Y MIS VOTOS
router.get('/monthly', authenticateJwt, activityController.getMonthlyActivities);
router.get('/my-votes', authenticateJwt, activityController.getMyVotedActivities);

router.post('/:id/organize', authenticateJwt, isAdmin, activityController.organizeActivity);
router.post('/select-monthly', authenticateJwt, isAdmin, activityController.selectActivitiesForMonth);
router.get('/stats', authenticateJwt, isAdmin, activityController.getActivityStats);

export default router;