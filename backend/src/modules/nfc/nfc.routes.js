import { Router } from 'express';
import { getDatabase } from '../../db/database.js';

const router = Router();

router.get('/resolve/:nfcUid', (req, res, next) => {
  try {
    const { nfcUid } = req.params;
    const db = getDatabase();

    const query = `
      SELECT 
        t.id as table_id, t.table_number, t.capacity_min, t.capacity_max, t.nfc_uid, t.qr_code_token, t.status as table_status,
        a.id as area_id, a.name as area_name, a.is_vip as area_is_vip,
        r.id as restaurant_id, r.name as restaurant_name, r.slug as restaurant_slug, r.tier as restaurant_tier, r.logo_url
      FROM tables t
      JOIN areas a ON t.area_id = a.id
      JOIN restaurants r ON t.restaurant_id = r.id
      WHERE t.nfc_uid = ? OR t.qr_code_token = ?
      LIMIT 1
    `;

    const tableInfo = db.prepare(query).get(nfcUid, nfcUid);
    if (!tableInfo) {
      return res.status(404).json({
        success: false,
        error: `Chip NFC o código '${nfcUid}' no registrado en el ecosistema Bookealo.`
      });
    }

    // Buscar si hay una reserva activa en este momento para esta mesa
    const today = new Date().toISOString().split('T')[0];
    const currentResQuery = `
      SELECT r.id, r.code, r.reservation_time, r.party_size, r.status, c.name as customer_name, c.vip_level
      FROM reservations r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.table_id = ? AND r.reservation_date = ? AND r.status IN ('confirmed', 'seated')
      LIMIT 1
    `;
    const activeReservation = db.prepare(currentResQuery).get(tableInfo.table_id, today);

    res.json({
      success: true,
      data: {
        tap_event: {
          nfc_uid: tableInfo.nfc_uid,
          timestamp: new Date().toISOString()
        },
        restaurant: {
          id: tableInfo.restaurant_id,
          name: tableInfo.restaurant_name,
          slug: tableInfo.restaurant_slug,
          tier: tableInfo.restaurant_tier,
          logo_url: tableInfo.logo_url
        },
        table: {
          id: tableInfo.table_id,
          number: tableInfo.table_number,
          area: tableInfo.area_name,
          is_vip: Boolean(tableInfo.area_is_vip),
          capacity: `${tableInfo.capacity_min}-${tableInfo.capacity_max}`,
          status: tableInfo.table_status
        },
        active_session: activeReservation ? {
          reservation_code: activeReservation.code,
          customer_name: activeReservation.customer_name,
          vip_level: activeReservation.vip_level,
          time: activeReservation.reservation_time,
          party_size: activeReservation.party_size,
          status: activeReservation.status
        } : null,
        capabilities: {
          dine_in_menu: true,
          split_bill: tableInfo.restaurant_tier >= 2,
          wallet_rsvp_sync: true,
          concierge_call: true
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
