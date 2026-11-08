-- ==========================================================
-- BOOKEALO RELATIONAL CORE SCHEMA (Week 1 Foundation)
-- Compatible with SQLite (Node 22 node:sqlite) & Cloudflare D1
-- ==========================================================

PRAGMA foreign_keys = ON;

-- 1. RESTAURANTES & ESTABLECIMIENTOS (Tier 1, 2, 3)
CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    category TEXT NOT NULL,
    tier INTEGER NOT NULL DEFAULT 1 CHECK (tier IN (1, 2, 3)),
    description TEXT,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Caracas',
    phone TEXT,
    whatsapp TEXT,
    google_maps_place_id TEXT,
    opening_time TEXT NOT NULL DEFAULT '12:00',
    closing_time TEXT NOT NULL DEFAULT '23:00',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 60,
    reservation_window_days INTEGER NOT NULL DEFAULT 30,
    cover_image_url TEXT,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'onboarding')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. ZONAS DEL ESTABLECIMIENTO (Salón, Terraza 360, Cava VIP)
CREATE TABLE IF NOT EXISTS areas (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_vip INTEGER NOT NULL DEFAULT 0 CHECK (is_vip IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

-- 3. MESAS Y FÍSICO (Capacidades, vinculación NFC)
CREATE TABLE IF NOT EXISTS tables (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    area_id TEXT NOT NULL,
    table_number TEXT NOT NULL,
    capacity_min INTEGER NOT NULL DEFAULT 2,
    capacity_max INTEGER NOT NULL DEFAULT 4,
    nfc_uid TEXT UNIQUE,
    qr_code_token TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas (id) ON DELETE CASCADE
);

-- 4. CRM DE CLIENTES / COMENSALES
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    vip_level TEXT NOT NULL DEFAULT 'STANDARD' CHECK (vip_level IN ('STANDARD', 'SILVER', 'GOLD', 'BLACK_EMPEROR')),
    total_visits INTEGER NOT NULL DEFAULT 0,
    total_spend REAL NOT NULL DEFAULT 0.0,
    dietary_preferences TEXT,
    notes TEXT,
    wallet_pass_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. MOTOR DE RESERVAS (Slots de tiempo, estado y asignación)
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    restaurant_id TEXT NOT NULL,
    table_id TEXT,
    customer_id TEXT NOT NULL,
    reservation_date TEXT NOT NULL, -- YYYY-MM-DD
    reservation_time TEXT NOT NULL, -- HH:MM
    duration_minutes INTEGER NOT NULL DEFAULT 90,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    special_requests TEXT,
    deposit_amount REAL DEFAULT 0.0,
    deposit_status TEXT NOT NULL DEFAULT 'not_required' CHECK (deposit_status IN ('not_required', 'pending', 'paid', 'refunded')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE RESTRICT,
    FOREIGN KEY (table_id) REFERENCES tables (id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE RESTRICT
);

-- 6. BOT DE RESEÑAS GOOGLE MAPS (LLM Engine)
CREATE TABLE IF NOT EXISTS google_reviews (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT NOT NULL,
    reviewer_name TEXT NOT NULL,
    reviewer_photo_url TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TEXT NOT NULL,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    ai_reply TEXT,
    reply_status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (reply_status IN ('pending_approval', 'auto_published', 'rejected')),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
);

-- ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_reservations_lookup 
ON reservations (restaurant_id, reservation_date, status);

CREATE INDEX IF NOT EXISTS idx_tables_lookup 
ON tables (restaurant_id, capacity_min, capacity_max);

CREATE INDEX IF NOT EXISTS idx_reviews_restaurant 
ON google_reviews (restaurant_id, reply_status);
