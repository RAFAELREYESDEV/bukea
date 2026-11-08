import { getDatabase } from './database.js';

export function runSeed() {
  const db = getDatabase();
  console.log('🌱 Ejecutando Seeder inicial de Bookealo Core...');

  // 1. Inserción de Restaurantes de Muestra (Tier 1, Tier 2, Tier 3)
  const insertRest = db.prepare(`
    INSERT OR REPLACE INTO restaurants (
      id, slug, name, tagline, category, tier, description, address, city, phone, whatsapp,
      google_maps_place_id, opening_time, closing_time, slot_interval_minutes, reservation_window_days,
      cover_image_url, logo_url, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRest.run(
    'rest_casacampo',
    'casa-campo-bistro',
    'Casa Campo Bistró & Grill',
    'Gastronomía de autor & brasas de precisión',
    'Alta Cocina & Grill',
    3, // Tier 3
    'Experiencia gastronómica exclusiva con tour inmersivo 360°, menú en Realidad Aumentada y servicio VIP personalizado.',
    'Av. Principal de Las Mercedes, Calle Madrid',
    'Caracas',
    '+58 212 991 4422',
    '+58 414 123 4567',
    'ChIJN1t_tDeuEmsRUsoyG83frY4',
    '12:00',
    '23:00',
    60,
    30,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    'active'
  );

  insertRest.run(
    'rest_komorebi',
    'komorebi-omakase',
    'Komorebi Omakase',
    'Tradición japonesa con cortes de estatus',
    'Japonés & Omakase',
    2, // Tier 2
    'Barra exclusiva para 12 comensales con tecnología de reserva digital y vinculación NFC en cada asiento.',
    'Altamira Village, Nivel Jardín',
    'Caracas',
    '+58 212 261 8899',
    '+58 424 987 6543',
    'ChIJrTLr-GyuEmsRBfy61i59si0',
    '13:00',
    '22:30',
    90,
    14,
    'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=200&q=80',
    'active'
  );

  insertRest.run(
    'rest_labrasserie',
    'la-brasserie-executive',
    'La Brasserie Executive Lounge',
    'Punto de encuentro de negocios y alta cocina clásica',
    'Bistró Francés & Coctelería',
    1, // Tier 1
    'Espacio cosmopolita para almuerzos ejecutivos y cenas de negocios. Conexión directa a Google Maps y gestión ágil de reservas.',
    'Centro Empresarial El Rosal, PB',
    'Caracas',
    '+58 212 952 1100',
    '+58 412 555 7788',
    'ChIJP3Sa8ziYEmsRUKgyFmh9AQM',
    '11:30',
    '23:00',
    60,
    30,
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=200&q=80',
    'active'
  );

  // 2. Inserción de Zonas (Areas)
  const insertArea = db.prepare(`
    INSERT OR REPLACE INTO areas (id, restaurant_id, name, description, is_vip)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertArea.run('area_cc_salon', 'rest_casacampo', 'Salón Principal', 'Zona central climatizada con iluminación tenue', 0);
  insertArea.run('area_cc_terraza', 'rest_casacampo', 'Terraza 360°', 'Vista panorámica al Ávila con lounge bar', 0);
  insertArea.run('area_cc_cava', 'rest_casacampo', 'Cava de Vinos Privada (VIP)', 'Exclusividad absoluta para cenas privadas', 1);

  insertArea.run('area_komo_barra', 'rest_komorebi', 'Barra Omakase', 'Experiencia frontal directa con el Itamae', 1);
  insertArea.run('area_komo_tatami', 'rest_komorebi', 'Salón Tatami', 'Ambiente íntimo tradicional', 0);

  // 3. Inserción de Mesas & Chips NFC
  const insertTable = db.prepare(`
    INSERT OR REPLACE INTO tables (
      id, restaurant_id, area_id, table_number, capacity_min, capacity_max, nfc_uid, qr_code_token, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Casa Campo Tables
  insertTable.run('tbl_cc_01', 'rest_casacampo', 'area_cc_salon', 'Mesa 01', 2, 2, 'NFC-BK-CC-001', 'QR-CC-001', 'available');
  insertTable.run('tbl_cc_02', 'rest_casacampo', 'area_cc_salon', 'Mesa 02', 2, 4, 'NFC-BK-CC-002', 'QR-CC-002', 'available');
  insertTable.run('tbl_cc_03', 'rest_casacampo', 'area_cc_salon', 'Mesa 03', 4, 6, 'NFC-BK-CC-003', 'QR-CC-003', 'available');
  insertTable.run('tbl_cc_terraza_01', 'rest_casacampo', 'area_cc_terraza', 'Terraza 01 (Vista)', 2, 4, 'NFC-BK-CC-010', 'QR-CC-010', 'available');
  insertTable.run('tbl_cc_terraza_02', 'rest_casacampo', 'area_cc_terraza', 'Terraza 02 (Lounge)', 4, 8, 'NFC-BK-CC-011', 'QR-CC-011', 'available');
  insertTable.run('tbl_cc_vip', 'rest_casacampo', 'area_cc_cava', 'Mesa Presidencial Cava', 6, 12, 'NFC-BK-CC-999', 'QR-CC-999', 'available');

  // Komorebi Tables
  insertTable.run('tbl_komo_b1', 'rest_komorebi', 'area_komo_barra', 'Puesto Barra 01', 1, 2, 'NFC-BK-KM-001', 'QR-KM-001', 'available');
  insertTable.run('tbl_komo_b2', 'rest_komorebi', 'area_komo_barra', 'Puesto Barra 02', 1, 2, 'NFC-BK-KM-002', 'QR-KM-002', 'available');
  insertTable.run('tbl_komo_t1', 'rest_komorebi', 'area_komo_tatami', 'Tatami Privado A', 2, 4, 'NFC-BK-KM-003', 'QR-KM-003', 'available');

  // 4. Inserción de Clientes CRM (Comensales con scoring y estatus VIP)
  const insertCustomer = db.prepare(`
    INSERT OR REPLACE INTO customers (
      id, name, email, phone, vip_level, total_visits, total_spend, dietary_preferences, notes, wallet_pass_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCustomer.run(
    'cust_alejandro_m',
    'Alejandro Mendoza',
    'a.mendoza@inversionesam.com',
    '+58 414 332 9988',
    'BLACK_EMPEROR',
    18,
    4650.0,
    'Vino preferido: Cabernet Franc / Alergia a nueces',
    'Cliente corporativo de máxima prioridad. Asignar siempre Cava VIP o Terraza principal.',
    'PASS-WAL-BK-99001'
  );

  insertCustomer.run(
    'cust_valentina_r',
    'Valentina Rossi',
    'valentina.rossi@artstudio.ve',
    '+58 412 884 1122',
    'GOLD',
    7,
    1420.0,
    'Vegetariana estricta, prefiere cócteles botánicos sin azúcar añadida',
    'Frecuenta para cenas de aniversario y eventos de arte.',
    'PASS-WAL-BK-44102'
  );

  insertCustomer.run(
    'cust_carlos_g',
    'Carlos Gómez',
    'carlos.gomez@fintechlatam.io',
    '+58 424 100 2030',
    'SILVER',
    3,
    580.0,
    'Sin restricciones particulares',
    'Comensal regular para almuerzos ejecutivos de negocios.',
    'PASS-WAL-BK-12093'
  );

  // 5. Inserción de Reservas de Muestra (Para probar el motor y detección de conflictos)
  const today = new Date().toISOString().split('T')[0];
  const insertRes = db.prepare(`
    INSERT OR REPLACE INTO reservations (
      id, code, restaurant_id, table_id, customer_id, reservation_date, reservation_time,
      duration_minutes, party_size, status, special_requests, deposit_amount, deposit_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRes.run(
    'res_bk_001',
    'BK-7701',
    'rest_casacampo',
    'tbl_cc_02',
    'cust_alejandro_m',
    today,
    '20:00',
    90,
    3,
    'confirmed',
    'Mesa junto a la bodega climatizada. Descorche de botella de colección propia.',
    50.0,
    'paid'
  );

  insertRes.run(
    'res_bk_002',
    'BK-8822',
    'rest_casacampo',
    'tbl_cc_terraza_01',
    'cust_valentina_r',
    today,
    '21:00',
    90,
    2,
    'confirmed',
    'Celebración de aniversario. Decoración sutil.',
    0.0,
    'not_required'
  );

  // 6. Inserción de Reseñas de Google Maps para el Bot LLM
  const insertReview = db.prepare(`
    INSERT OR REPLACE INTO google_reviews (
      id, restaurant_id, reviewer_name, reviewer_photo_url, rating, comment, review_date, sentiment, ai_reply, reply_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReview.run(
    'rev_gm_01',
    'rest_casacampo',
    'Santiago Rivas',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    5,
    'Una experiencia de otro nivel. El corte Tomahawk y la atención personalizada del Sommelier hicieron de nuestra cena algo memorable. El acceso con la reserva digital de Bookealo fue instantáneo.',
    today,
    'positive',
    'Estimado Santiago, un honor absoluto recibirle en Casa Campo Bistró. Nos llena de orgullo que nuestro Tomahawk y la curaduría de nuestro Sommelier hayan superado sus expectativas. Será un placer volver a tenerle en su casa. ¡Hasta pronto!',
    'auto_published'
  );

  insertReview.run(
    'rev_gm_02',
    'rest_casacampo',
    'María Eugenia Morales',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    3,
    'La comida estuvo exquisita, pero tuvimos que esperar unos 15 minutos en el lobby antes de que nuestra mesa en la terraza estuviera lista a pesar de tener reserva.',
    today,
    'neutral',
    null,
    'pending_approval'
  );

  console.log('✅ Base de datos sembrada con éxito con datos iniciales.');
}

// Ejecutar si se llama directamente
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}
