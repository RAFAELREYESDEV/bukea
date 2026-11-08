import { getDatabase } from '../../db/database.js';

export class CRMService {
  static listCustomers({ search = '', vipLevel = null, limit = 50, offset = 0 } = {}) {
    const db = getDatabase();
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (vipLevel) {
      query += ' AND vip_level = ?';
      params.push(vipLevel);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY total_spend DESC, total_visits DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const customers = db.prepare(query).all(...params);

    const countStmt = db.prepare('SELECT COUNT(*) as total FROM customers');
    const total = countStmt.get()?.total || 0;

    return {
      total,
      limit: Number(limit),
      offset: Number(offset),
      customers
    };
  }

  static getCustomerById(id) {
    const db = getDatabase();
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    if (!customer) return null;

    // Get reservations history
    const historyStmt = db.prepare(`
      SELECT 
        r.id, r.code, r.reservation_date, r.reservation_time, r.party_size, r.status,
        rest.name as restaurant_name, rest.slug as restaurant_slug,
        t.table_number, a.name as area_name
      FROM reservations r
      JOIN restaurants rest ON r.restaurant_id = rest.id
      LEFT JOIN tables t ON r.table_id = t.id
      LEFT JOIN areas a ON t.area_id = a.id
      WHERE r.customer_id = ?
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `);
    const history = historyStmt.all(id);

    return {
      ...customer,
      reservations_count: history.length,
      history
    };
  }

  static updateVIPStatus(id, vipLevel, notes) {
    const db = getDatabase();
    const validLevels = ['STANDARD', 'SILVER', 'GOLD', 'BLACK_EMPEROR'];
    if (!validLevels.includes(vipLevel)) {
      throw new Error(`Nivel VIP '${vipLevel}' inválido`);
    }

    let query = 'UPDATE customers SET vip_level = ?, updated_at = CURRENT_TIMESTAMP';
    const params = [vipLevel];

    if (notes !== undefined) {
      query += ', notes = ?';
      params.push(notes);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const info = db.prepare(query).run(...params);
    if (info.changes === 0) {
      throw new Error(`Comensal con ID '${id}' no encontrado`);
    }

    return this.getCustomerById(id);
  }
}
