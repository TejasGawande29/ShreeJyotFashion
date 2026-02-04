import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const hasRazorpayCredentials = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET);

if (!hasRazorpayCredentials) {
  console.warn('⚠️  Razorpay credentials not configured. Payment features will be limited.');
}

// Initialize Razorpay instance only if credentials are available
export const razorpayInstance = hasRazorpayCredentials 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    })
  : null;

export const RAZORPAY_CONFIG = {
  KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  SECRET: process.env.RAZORPAY_SECRET || '',
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  CURRENCY: 'INR',
  ENABLED: hasRazorpayCredentials,
};

export default razorpayInstance;
