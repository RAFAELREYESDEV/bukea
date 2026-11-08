import { z } from 'zod';
import { ReservationService } from './reservation.service.js';

const createReservationSchema = z.object({
  restaurantId: z.string().min(1, 'restaurantId es requerido'),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  partySize: z.number().int().min(1, 'partySize debe ser al menos 1').max(20, 'Máximo 20 personas por reserva directa'),
  specialRequests: z.string().optional().default(''),
  areaId: z.string().optional().nullable(),
  customer: z.object({
    name: z.string().min(2, 'Nombre del comensal requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(7, 'Teléfono requerido'),
    notes: z.string().optional().default('')
  })
});

export class ReservationController {
  static async checkAvailability(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const { date, partySize, areaId } = req.query;

      if (!date) {
        return res.status(400).json({ success: false, error: "Parámetro 'date' (YYYY-MM-DD) es requerido" });
      }

      const result = ReservationService.checkAvailability({
        restaurantId,
        date,
        partySize: partySize ? Number(partySize) : 2,
        areaId
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const parsed = createReservationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: 'Datos de validación incorrectos',
          details: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
        });
      }

      const reservation = ReservationService.createReservation({
        restaurantId: parsed.data.restaurantId,
        customerData: parsed.data.customer,
        reservationDate: parsed.data.reservationDate,
        reservationTime: parsed.data.reservationTime,
        partySize: parsed.data.partySize,
        specialRequests: parsed.data.specialRequests,
        areaId: parsed.data.areaId
      });

      res.status(201).json({
        success: true,
        message: 'Reserva confirmada con éxito',
        data: reservation
      });
    } catch (error) {
      if (error.statusCode === 409) {
        return res.status(409).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  static async getByCode(req, res, next) {
    try {
      const { code } = req.params;
      const reservation = ReservationService.getByCode(code);
      if (!reservation) {
        return res.status(404).json({ success: false, error: `Reserva con código '${code}' no encontrada.` });
      }
      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { restaurantId, date, status } = req.query;
      const reservations = ReservationService.listAll({ restaurantId, date, status });
      res.json({
        success: true,
        count: reservations.length,
        data: reservations
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { code } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: 'El campo status es requerido' });
      }
      const updated = ReservationService.updateStatus(code, status);
      res.json({
        success: true,
        message: `Reserva actualizada a estado '${status}'`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
