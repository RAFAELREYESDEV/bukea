import { ReviewsService } from './reviews.service.js';

export class ReviewsController {
  static async list(req, res, next) {
    try {
      const { restaurantId, replyStatus } = req.query;
      const reviews = ReviewsService.list({ restaurantId, replyStatus });
      res.json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateReply(req, res, next) {
    try {
      const { id } = req.params;
      const updatedReview = await ReviewsService.generateReply(id);
      res.json({
        success: true,
        message: 'Respuesta con LLM generada con éxito',
        data: updatedReview
      });
    } catch (error) {
      next(error);
    }
  }

  static async publishReply(req, res, next) {
    try {
      const { id } = req.params;
      const { replyText } = req.body;
      const published = ReviewsService.publishReply(id, replyText);
      res.json({
        success: true,
        message: 'Respuesta aprobada y publicada en Google Maps con éxito',
        data: published
      });
    } catch (error) {
      next(error);
    }
  }

  static async webhookIngest(req, res, next) {
    try {
      const { restaurantId, reviewerName, reviewerPhotoUrl, rating, comment, reviewDate, autoGenerateReply } = req.body;
      if (!restaurantId || !reviewerName || rating === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Campos obligatorios: restaurantId, reviewerName, rating'
        });
      }

      const review = ReviewsService.ingestWebhookReview({
        restaurantId,
        reviewerName,
        reviewerPhotoUrl,
        rating,
        comment,
        reviewDate
      });

      // Si se solicita generación automática inmediata
      let finalReview = review;
      if (autoGenerateReply) {
        finalReview = await ReviewsService.generateReply(review.id);
      }

      res.status(201).json({
        success: true,
        message: 'Reseña de Google Maps ingerida con éxito',
        data: finalReview
      });
    } catch (error) {
      next(error);
    }
  }
}
