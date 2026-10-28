import { Router } from 'express';
import { CRMController } from './crm.controller.js';

const router = Router();

router.get('/', CRMController.list);
router.get('/:id', CRMController.getById);
router.patch('/:id/vip', CRMController.updateVIP);

export default router;
