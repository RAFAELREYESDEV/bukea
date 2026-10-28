import crypto from 'node:crypto';
import { getDatabase } from '../../db/database.js';

export class ReservationService {
  /**
   * Helper: convierte "HH:MM" a minutos
   */
  static timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Helper: convierte minutos a "HH:MM"
   */
  static minutesToTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Genera los slots horarios según horario del restaurante
   */
  static generateSlots(openingTime, closingTime, intervalMinutes = 60) {
    const start = this.timeToMinutes(openingTime);
    let end = this.timeToMinutes(closingTime);
    
    // Si cierra después de medianoche
    if (end < start) end += 24 * 60;

    const slots = [];
    for (let current = start; current <= end - 60; current += intervalMinutes) {
      const normalizedMinutes = current % (24 * 60);
      slots.push(this.minutesToTime(normalizedMinutes));
    }
    return slots;
  }

  /**
   * Motor de Disponibilidad Base (Tier 1/2/3)
   */
  static checkAvailability({ restaurantId, date, partySize, areaId = null, durationMinutes = 90 }) {
    const db = getDatabase();

    // 1. Obtener restaurante
    const restStmt = db.prepare('SELECT * FROM restaurants WHERE id = ? OR slug = ? LIMIT 1');
    const restaurant = restStmt.get(restaurantId, restaurantId);
    if (!restaurant) {
      throw new Error(`Restaurante '${restaurantId}' no encontrado`);
    }

    const size = Number(partySize) || 2;

    // 2. Obtener mesas candidatas según capacidad
    let tableQuery = `
      SELECT t.*, a.name as area_name, a.is_vip as area_is_vip 
      FROM tables t
      JOIN areas a ON t.area_id = a.id
      WHERE t.restaurant_id = ? AND t.status != 'maintenance'
      AND t.capacity_max >= ?
    `;
    const tableParams = [restaurant.id, size];

    if (areaId) {
      tableQuery += ' AND t.area_id = ?';
      tableParams.push(areaId);
    }

    tableQuery += ' ORDER BY (t.capacity_max - ?) ASC, a.is_vip DESC';
    tableParams.push(size);

    const eligibleTables = db.prepare(tableQuery).all(...tableParams);

    // 3. Obtener reservas existentes para esa fecha
    const resStmt = db.prepare(`
      SELECT id, table_id, reservation_time, duration_minutes, party_size, status 
      FROM reservations 
      WHERE restaurant_id = ? AND reservation_date = ? 
      AND status IN ('pending', 'confirmed', 'seated')
    `);
    const activeReservations = resStmt.all(restaurant.id, date);

    // 4. Calcular slots y disponibilidad
    const timeSlots = this.generateSlots(
      restaurant.opening_time, 
      restaurant.closing_time, 
      restaurant.slot_interval_minutes
    );

    const slotResults = timeSlots.map(slotTime => {
      const slotStart = this.timeToMinutes(slotTime);
      const slotEnd = slotStart + durationMinutes;

      // Filtrar mesas que están libres en este slot
      const freeTables = eligibleTables.filter(table => {
        const hasConflict = activeReservations.some(res => {
          if (res.table_id !== table.id) return false;
          const resStart = this.timeToMinutes(res.reservation_time);
          const resEnd = resStart + (res.duration_minutes || durationMinutes);
          // Solapamiento de intervalos: max(start1, start2) < min(end1, end2)
          return Math.max(slotStart, resStart) < Math.min(slotEnd, resEnd);
        });
        return !hasConflict;
      });

      const isAvailable = freeTables.length > 0;

      return {
        time: slotTime,
        status: isAvailable ? 'AVAILABLE' : 'SOLD_OUT',
        available_tables_count: freeTables.length,
        optimal_table: isAvailable ? {
          id: freeTables[0].id,
          table_number: freeTables[0].table_number,
          area_name: freeTables[0].area_name,
          capacity: `${freeTables[0].capacity_min}-${freeTables[0].capacity_max} personas`
        } : null
      };
    });

    return {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        tier: restaurant.tier,
        opening_time: restaurant.opening_time,
        closing_time: restaurant.closing_time
      },
      date,
      party_size: size,
      slots: slotResults,
      summary: {
        total_slots: slotResults.length,
        available_slots: slotResults.filter(s => s.status === 'AVAILABLE').length
      }
    };
  }

  /**
   * Crear Reserva con Prevención de Overbooking y Conexión a CRM
   */
  static createReservation({
    restaurantId,
    customerData, // { name, email, phone, notes }
    reservationDate,
    reservationTime,
    partySize,
    specialRequests = '',
    areaId = null,
    durationMinutes = 90
  }) {
    const db = getDatabase();

    // 1. Validar restaurante
    const rest = db.prepare('SELECT * FROM restaurants WHERE id = ? OR slug = ? LIMIT 1')
      .get(restaurantId, restaurantId);
    if (!rest) {
      throw new Error(`Restaurante '${restaurantId}' no existe`);
    }

    const size = Number(partySize) || 2;

    // 2. Verificar disponibilidad exacta para el slot seleccionado
    const availability = this.checkAvailability({
      restaurantId: rest.id,
      date: reservationDate,
      partySize: size,
      areaId,
      durationMinutes
    });

    const targetSlot = availability.slots.find(s => s.time === reservationTime);
    if (!targetSlot || targetSlot.status !== 'AVAILABLE') {
      const error = new Error(`El horario ${reservationTime} para ${size} personas no está disponible en la fecha seleccionada.`);
      error.statusCode = 409;
      throw error;
    }

    const assignedTableId = targetSlot.optimal_table.id;

    // 3. Gestionar CRM de Cliente (Buscar existente o crear nuevo)
    let customer = db.prepare('SELECT * FROM customers WHERE email = ? OR phone = ? LIMIT 1')
      .get(customerData.email, customerData.phone);

    if (!customer) {
      const newCustId = `cust_${crypto.randomUUID().slice(0, 8)}`;
      db.prepare(`
        INSERT INTO customers (id, name, email, phone, vip_level, total_visits, notes)
        VALUES (?, ?, ?, ?, 'STANDARD', 1, ?)
      `).run(newCustId, customerData.name, customerData.email, customerData.phone, customerData.notes || '');

      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(newCustId);
    } else {
      // Incrementar visitas
      db.prepare('UPDATE customers SET total_visits = total_visits + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(customer.id);
    }

    // 4. Generar Código Único de Reserva (BK-XXXX)
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const reservationCode = `BK-${randomHex}`;
    const reservationId = `res_${crypto.randomUUID()}`;

    // 5. Insertar Reserva
    db.prepare(`
      INSERT INTO reservations (
        id, code, restaurant_id, table_id, customer_id, reservation_date,
        reservation_time, duration_minutes, party_size, status, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
    `).run(
      reservationId,
      reservationCode,
      rest.id,
      assignedTableId,
      customer.id,
      reservationDate,
      reservationTime,
      durationMinutes,
      size,
      specialRequests
    );

    // 6. Retornar detalle completo
    return this.getByCode(reservationCode);
  }

  /**
   * Buscar reserva por código único
   */
  static getByCode(code) {
    const db = getDatabase();
    const query = `
      SELECT 
        r.id, r.code, r.reservation_date, r.reservation_time, r.duration_minutes,
        r.party_size, r.status, r.special_requests, r.deposit_amount, r.deposit_status, r.created_at,
        rest.id as restaurant_id, rest.name as restaurant_name, rest.slug as restaurant_slug, 
        rest.address as restaurant_address, rest.phone as restaurant_phone,
        t.table_number, a.name as area_name, a.is_vip as area_is_vip,
        c.id as customer_id, c.name as customer_name, c.email as customer_email,
        c.phone as customer_phone, c.vip_level as customer_vip_level
      FROM reservations r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      LEFT JOIN tables t ON r.table_id = t.id
      LEFT JOIN areas a ON t.area_id = a.id
      JOIN customers c ON r.customer_id = c.id
      WHERE r.code = ? OR r.id = ?
      LIMIT 1
    `;
    const res = db.prepare(query).get(code, code);
    if (!res) return null;

    return {
      code: res.code,
      id: res.id,
      date: res.reservation_date,
      time: res.reservation_time,
      duration_minutes: res.duration_minutes,
      party_size: res.party_size,
      status: res.status,
      special_requests: res.special_requests,
      restaurant: {
        id: res.restaurant_id,
        name: res.restaurant_name,
        slug: res.restaurant_slug,
        address: res.restaurant_address,
        phone: res.restaurant_phone
      },
      table: {
        number: res.table_number,
        area: res.area_name,
        is_vip: Boolean(res.area_is_vip)
      },
      customer: {
        id: res.customer_id,
        name: res.customer_name,
        email: res.customer_email,
        phone: res.customer_phone,
        vip_level: res.customer_vip_level
      },
      created_at: res.created_at
    };
  }

  /**
   * Listar reservas con filtros para el Portal / Dashboard
   */
  static listAll({ restaurantId, date, status } = {}) {
    const db = getDatabase();
    let query = `
      SELECT 
        r.id, r.code, r.reservation_date, r.reservation_time, r.party_size, r.status,
        rest.name as restaurant_name, t.table_number, a.name as area_name,
        c.name as customer_name, c.phone as customer_phone, c.vip_level
      FROM reservations r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      LEFT JOIN tables t ON r.table_id = t.id
      LEFT JOIN areas a ON t.area_id = a.id
      JOIN customers c ON r.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (restaurantId) {
      query += ' AND (r.restaurant_id = ? OR rest.slug = ?)';
      params.push(restaurantId, restaurantId);
    }
    if (date) {
      query += ' AND r.reservation_date = ?';
      params.push(date);
    }
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.reservation_date ASC, r.reservation_time ASC';
    return db.prepare(query).all(...params);
  }

  /**
   * Actualizar estado (confirmed -> seated -> completed / cancelled)
   */
  static updateStatus(codeOrId, status) {
    const db = getDatabase();
    const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado '${status}' inválido.`);
    }

    const stmt = db.prepare(`
      UPDATE reservations 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE code = ? OR id = ?
    `);
    const info = stmt.run(status, codeOrId, codeOrId);
    if (info.changes === 0) {
      throw new Error(`Reserva '${codeOrId}' no encontrada.`);
    }

    return this.getByCode(codeOrId);
  }
}
