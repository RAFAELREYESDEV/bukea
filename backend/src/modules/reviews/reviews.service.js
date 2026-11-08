import crypto from 'node:crypto';
import { getDatabase } from '../../db/database.js';
import { ENV } from '../../config/env.js';

export class ReviewsService {
  static list({ restaurantId, replyStatus } = {}) {
    const db = getDatabase();
    let query = `
      SELECT r.*, rest.name as restaurant_name 
      FROM google_reviews r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE 1=1
    `;
    const params = [];

    if (restaurantId) {
      query += ' AND (r.restaurant_id = ? OR rest.slug = ?)';
      params.push(restaurantId, restaurantId);
    }
    if (replyStatus) {
      query += ' AND r.reply_status = ?';
      params.push(replyStatus);
    }

    query += ' ORDER BY r.created_at DESC';
    return db.prepare(query).all(...params);
  }

  static getById(id) {
    const db = getDatabase();
    const query = `
      SELECT r.*, rest.name as restaurant_name, rest.category as restaurant_category
      FROM google_reviews r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      WHERE r.id = ?
    `;
    return db.prepare(query).get(id);
  }

  /**
   * Generador de Respuestas LLM Inteligentes con Tono Hospitalario Bookealo
   */
  static async generateReply(reviewId) {
    const db = getDatabase();
    const review = this.getById(reviewId);
    if (!review) {
      throw new Error(`Reseña con ID '${reviewId}' no encontrada.`);
    }

    const { reviewer_name, rating, comment, restaurant_name, restaurant_category } = review;

    let sentiment = 'positive';
    if (rating <= 2) sentiment = 'negative';
    else if (rating === 3) sentiment = 'neutral';

    let generatedReply = '';

    // Si cuenta con Gemini API Key configurada, llamamos a la API
    if (ENV.GEMINI_API_KEY) {
      try {
        const prompt = `Actúa como el Director de Hospitalidad y Relaciones Públicas de "${restaurant_name}" (${restaurant_category}), respaldado por la tecnología exclusiva de Bookealo.
Redacta una respuesta pública, ejecutiva, cálida y de alta gastronomía a la siguiente reseña de Google Maps:
Comensal: ${reviewer_name}
Calificación: ${rating}/5 estrellas
Comentario: "${comment || 'Sin texto'}"

Reglas:
- Máximo 3 o 4 oraciones.
- Tono sofisticado, empático y respetuoso.
- Si la calificación es positiva (4-5), agradece la visita y elogia su apreciación gastronómica.
- Si es neutral o negativa (1-3), sé empático, no defensivo, ofrece seguimiento directo de la gerencia.
- No uses clichés vacíos.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          generatedReply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        }
      } catch (err) {
        console.warn('Fallo en llamada externa a Gemini API, usando motor heurístico de hospitalidad Bookealo:', err.message);
      }
    }

    // Fallback con Motor Heurístico de Alta Fidelidad Bookealo
    if (!generatedReply) {
      if (rating >= 4) {
        generatedReply = `Estimado/a ${reviewer_name}, ha sido un verdadero privilegio recibirle en ${restaurant_name}. Nos complace enormemente saber que su paso por nuestras mesas cumplió con el estándar de excelencia que diseñamos en cada detalle. Todo nuestro equipo gastronómico y de servicio espera tener el honor de darle la bienvenida muy pronto para otra velada memorable.`;
      } else if (rating === 3) {
        generatedReply = `Estimado/a ${reviewer_name}, agradecemos sinceramente que se haya tomado el tiempo de compartir su retroalimentación en ${restaurant_name}. Valoramos cada una de sus observaciones con la máxima seriedad, pues nuestro compromiso es ofrecer siempre una experiencia impecable. Nos encantaría conversar directamente con usted para atender cada detalle en su próxima reserva; por favor contáctenos a nuestra línea de atención directa.`;
      } else {
        generatedReply = `Estimado/a ${reviewer_name}, lamentamos con la mayor sinceridad que su experiencia reciente en ${restaurant_name} no haya reflejado el estándar de excelencia y calidez que nos define. Tomamos nota directa de su situación y deseamos poner a su disposición a nuestra gerencia general para escucharle y subsanar cualquier inconformidad. Le invitamos a comunicarse con nosotros a nuestro canal VIP para brindarle la atención que usted merece.`;
      }
    }

    // Actualizar en base de datos
    db.prepare(`
      UPDATE google_reviews 
      SET ai_reply = ?, sentiment = ?
      WHERE id = ?
    `).run(generatedReply, sentiment, reviewId);

    return this.getById(reviewId);
  }

  /**
   * Publicar o Aprobar Respuesta para Google Maps
   */
  static publishReply(reviewId, customReplyText = null) {
    const db = getDatabase();
    const review = this.getById(reviewId);
    if (!review) throw new Error(`Reseña '${reviewId}' no encontrada.`);

    const replyToPublish = customReplyText || review.ai_reply;
    if (!replyToPublish) {
      throw new Error('No hay ninguna respuesta generada para publicar.');
    }

    db.prepare(`
      UPDATE google_reviews 
      SET ai_reply = ?, reply_status = 'auto_published', published_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(replyToPublish, reviewId);

    return this.getById(reviewId);
  }

  /**
   * Webhook de ingestión de nuevas reseñas desde Google Business Profile / n8n
   */
  static ingestWebhookReview({ restaurantId, reviewerName, reviewerPhotoUrl, rating, comment, reviewDate }) {
    const db = getDatabase();
    const reviewId = `rev_${crypto.randomUUID().slice(0, 8)}`;
    const date = reviewDate || new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO google_reviews (
        id, restaurant_id, reviewer_name, reviewer_photo_url, rating, comment, review_date, reply_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_approval')
    `).run(reviewId, restaurantId, reviewerName, reviewerPhotoUrl || null, Number(rating), comment || '', date);

    return this.getById(reviewId);
  }
}
