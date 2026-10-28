import { Router } from 'express';
import { RestaurantController } from './restaurant.controller.js';

const router = Router();

router.get('/', RestaurantController.getAll);
router.get('/:idOrSlug', RestaurantController.getById);
router.get('/:id/tables', RestaurantController.getTables);

export default router;
