-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rental_id INTEGER REFERENCES rentals(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment details
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('rental', 'deposit', 'refund', 'late_fee', 'damage_charge')),
  payment_method VARCHAR(20) NOT NULL DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'cash', 'bank_transfer')),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
  
  -- Razorpay specific fields
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  razorpay_refund_id VARCHAR(255),
  
  -- Transaction details
  transaction_date TIMESTAMP,
  refund_amount DECIMAL(10, 2),
  refund_date TIMESTAMP,
  failure_reason TEXT,
  
  -- Metadata
  notes JSONB,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_rental_id ON payments(rental_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Add comment
COMMENT ON TABLE payments IS 'Payment transactions for orders and rentals';
