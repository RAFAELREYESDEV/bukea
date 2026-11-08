import { getDatabase } from '../../db/database.js';

export class RestaurantService {
  static listAll({ tier, category, status = 'active' } = {}) {
    const db = getDatabase();
    let query = 'SELECT * FROM restaurants WHERE status = ?';
    const params = [status];

    if (tier) {
      query += ' AND tier = ?';
      params.push(Number(tier));
    }
    if (category) {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    query += ' ORDER BY tier DESC, name ASC';
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  static getByIdOrSlug(identifier) {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM restaurants 
      WHERE id = ? OR slug = ? 
      LIMIT 1
    `);
    const restaurant = stmt.get(identifier, identifier);
    if (!restaurant) return null;

    // Fetch areas
    const areasStmt = db.prepare('SELECT * FROM areas WHERE restaurant_id = ? ORDER BY is_vip DESC, name ASC');
    const areas = areasStmt.all(restaurant.id);

    // Fetch tables count
    const tablesStmt = db.prepare(`
      SELECT COUNT(*) as total_tables, SUM(capacity_max) as total_capacity 
      FROM tables 
      WHERE restaurant_id = ?
    `);
    const stats = tablesStmt.get(restaurant.id);

    return {
      ...restaurant,
      areas,
      stats: {
        total_tables: stats?.total_tables || 0,
        total_capacity: stats?.total_capacity || 0
      }
    };
  }

  static getTables(restaurantId, areaId = null) {
    const db = getDatabase();
    let query = `
      SELECT t.*, a.name as area_name, a.is_vip as area_is_vip 
      FROM tables t 
      JOIN areas a ON t.area_id = a.id 
      WHERE t.restaurant_id = ?
    `;
    const params = [restaurantId];

    if (areaId) {
      query += ' AND t.area_id = ?';
      params.push(areaId);
    }

    query += ' ORDER BY a.is_vip DESC, t.table_number ASC';
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }
}
