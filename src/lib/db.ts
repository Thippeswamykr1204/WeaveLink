import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// TRADEOFF: `weavelink.db` is written next to the project root by default, which
// is fine for local dev / a long-lived single server. If this app is deployed to
// a serverless platform (Vercel, AWS Lambda, etc.) the filesystem is read-only
// outside of /tmp and is NOT persisted between invocations/cold starts — each
// request could see a fresh, empty DB. Set DB_DIR=/tmp (or mount a persistent
// volume / swap to a hosted DB like Turso/LibSQL/Postgres) for real serverless
// deployments. Controlled here via an env var so no code change is needed later.
const dbDir = process.env.DB_DIR || process.cwd();
const dbPath = path.join(dbDir, "weavelink.db");

// Ensure the directory exists (matters when DB_DIR=/tmp on some platforms).
fs.mkdirSync(dbDir, { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __weavelinkDb: Database.Database | undefined;
}

// Reuse a single connection across hot-reloads / module re-imports in dev.
const db = global.__weavelinkDb || new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__weavelinkDb = db;

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    category TEXT,
    fabricType TEXT,
    material TEXT,
    gsm INTEGER,
    width TEXT,
    weave TEXT,
    finish TEXT,
    origin TEXT,
    pricePerMeter REAL,
    moq INTEGER,
    stock INTEGER,
    colors TEXT,          -- JSON array
    description TEXT,
    image TEXT,
    bulkTiers TEXT,       -- JSON array
    status TEXT,
    addedOn TEXT,
    addedTimestamp INTEGER,
    -- 'inventory' = supplier-added InventoryProduct rows (the only ones the
    -- app's CRUD actions read/write). 'marketplace' = the static public
    -- catalog from mockData.ts, seeded for completeness/parity with the
    -- seed spec but not currently read by any store action.
    source TEXT NOT NULL DEFAULT 'inventory',
    -- JSON blob for marketplace-only fields that don't fit InventoryProduct
    -- (supplier, supplierRating, badge, features, etc). Null for inventory rows.
    extra TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TEXT,
    timestamp INTEGER,
    supplier TEXT,
    supplierVerified INTEGER,
    location TEXT,
    amount REAL,
    status TEXT,
    deliveryDate TEXT,
    paymentMethod TEXT,
    buyerCompany TEXT,
    buyerEmail TEXT,
    buyerPhone TEXT,
    buyerVerified INTEGER,
    shippingAddress TEXT,
    billingAddress TEXT,
    gstin TEXT,
    orderNotes TEXT,
    paymentStatus TEXT,
    activityLog TEXT      -- JSON array
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    productId TEXT,
    quantity INTEGER,
    pricePerMeter REAL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL DEFAULT 'guest',
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    UNIQUE(userId, productId)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,      -- email, used as natural key
    name TEXT,
    company TEXT,
    role TEXT,
    email TEXT,
    phone TEXT,
    designation TEXT,
    department TEXT,
    companyType TEXT,
    businessType TEXT,
    gstin TEXT,
    yearEstablished TEXT,
    employeeRange TEXT,
    memberSince TEXT,
    onboarded INTEGER
  );
`);

export default db;
