import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be limited.');
}

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET || '',
});

export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  SECRET: process.env.RAZORPAY_SECRET || '',
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  CURRENCY: 'INR',
};

export default razorpayInstance;
