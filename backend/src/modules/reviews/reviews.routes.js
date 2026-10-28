import { Router } from 'express';
import { ReviewsController } from './reviews.controller.js';

const router = Router();

router.get('/', ReviewsController.list);
router.post('/webhook', ReviewsController.webhookIngest);
router.post('/:id/generate-ai-reply', ReviewsController.generateReply);
router.post('/:id/publish', ReviewsController.publishReply);

export default router;
