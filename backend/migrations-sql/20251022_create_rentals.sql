-- Migration: create rentals and rental_items tables
-- Run with psql against shreejyot_fashion_db

CREATE TABLE IF NOT EXISTS rentals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  security_deposit NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rentals_start_end ON rentals (start_date, end_date);

CREATE TABLE IF NOT EXISTS rental_items (
  id SERIAL PRIMARY KEY,
  rental_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_variant_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_day NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_rental_items_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
  CONSTRAINT fk_rental_items_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_rental_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

CREATE INDEX IF NOT EXISTS idx_rental_items_rental_id ON rental_items (rental_id);
