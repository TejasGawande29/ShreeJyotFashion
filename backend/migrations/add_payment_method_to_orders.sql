-- Add missing payment_method column to orders table

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20);

-- Set default for existing rows
UPDATE orders 
SET payment_method = 'cod' 
WHERE payment_method IS NULL;

-- Add comment
COMMENT ON COLUMN orders.payment_method IS 'Payment method: cod, razorpay, card, upi, wallet';
