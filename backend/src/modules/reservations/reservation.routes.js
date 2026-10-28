import { Router } from 'express';
import { ReservationController } from './reservation.controller.js';

const router = Router();

router.get('/availability/:restaurantId', ReservationController.checkAvailability);
router.post('/', ReservationController.create);
router.get('/', ReservationController.list);
router.get('/:code', ReservationController.getByCode);
router.patch('/:code/status', ReservationController.updateStatus);

export default router;
