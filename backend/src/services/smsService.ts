import SmsLog, { SmsStatus, SmsType } from '../models/SmsLog';
import logger from '../utils/logger';

// SMS configuration
const SMS_PROVIDER = process.env.SMS_PROVIDER || 'mock'; // 'twilio', 'msg91', or 'mock'
const SMS_API_KEY = process.env.SMS_API_KEY || '';
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'SHRJYT';

// SMS sending interface
interface SmsOptions {
  to: string;
  message: string;
  userId?: number;
  smsType: SmsType;
}

/**
 * Send SMS and log to database
 * Currently using mock implementation - replace with actual SMS provider
 */
export const sendSms = async (options: SmsOptions): Promise<boolean> => {
  try {
    // If SMS provider not configured, log but don't fail
    if (SMS_PROVIDER === 'mock' || !SMS_API_KEY) {
      logger.warn(`SMS (MOCK): To ${options.to}, Message: ${options.message}`);
      
      // Log to database as sent (in production, would be failed)
      await SmsLog.create({
        user_id: options.userId || null,
        phone_number: options.to,
        message: options.message,
        sms_type: options.smsType,
        status: SmsStatus.SENT,
        sent_at: new Date(),
        gateway_response: { mock: true, provider: 'mock' },
      });
      
      return true;
    }

    // TODO: Implement actual SMS providers
    let gatewayResponse: any = {};
    let success = false;

    switch (SMS_PROVIDER) {
      case 'twilio':
        // TODO: Implement Twilio SMS
        gatewayResponse = await sendViaTwilio(options.to, options.message);
        success = true;
        break;

      case 'msg91':
        // TODO: Implement MSG91 SMS
        gatewayResponse = await sendViaMsg91(options.to, options.message);
        success = true;
        break;

      default:
        throw new Error(`Unknown SMS provider: ${SMS_PROVIDER}`);
    }

    // Log success to database
    await SmsLog.create({
      user_id: options.userId || null,
      phone_number: options.to,
      message: options.message,
      sms_type: options.smsType,
      status: SmsStatus.SENT,
      sent_at: new Date(),
      gateway_response: gatewayResponse,
    });

    logger.info(`SMS sent to ${options.to}`);
    return success;
  } catch (error: any) {
    logger.error('Error sending SMS:', error);

    // Log failure to database
    await SmsLog.create({
      user_id: options.userId || null,
      phone_number: options.to,
      message: options.message,
      sms_type: options.smsType,
      status: SmsStatus.FAILED,
      sent_at: new Date(),
      gateway_response: { error: error.message },
    });

    return false;
  }
};

/**
 * Send via Twilio (placeholder)
 */
const sendViaTwilio = async (to: string, message: string): Promise<any> => {
  // TODO: Implement Twilio integration
  // const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  // const result = await client.messages.create({
  //   body: message,
  //   from: TWILIO_PHONE_NUMBER,
  //   to: to
  // });
  // return result;
  
  throw new Error('Twilio integration not implemented');
};

/**
 * Send via MSG91 (placeholder)
 */
const sendViaMsg91 = async (to: string, message: string): Promise<any> => {
  // TODO: Implement MSG91 integration
  // const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
  //   sender: SMS_SENDER_ID,
  //   mobiles: to,
  //   message: message,
  //   authkey: SMS_API_KEY
  // });
  // return response.data;
  
  throw new Error('MSG91 integration not implemented');
};

/**
 * Send order confirmation SMS
 */
export const sendOrderConfirmationSms = async (
  phoneNumber: string,
  userId: number,
  orderData: {
    orderNumber: string;
    total: number;
  }
): Promise<boolean> => {
  const message = `Dear Customer, Your order #${orderData.orderNumber} for Rs.${orderData.total.toFixed(2)} has been confirmed. Thank you for shopping with Shreejyot Fashion!`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.ORDER_CONFIRMATION,
  });
};

/**
 * Send order shipped SMS
 */
export const sendOrderShippedSms = async (
  phoneNumber: string,
  userId: number,
  orderData: {
    orderNumber: string;
    trackingNumber?: string;
  }
): Promise<boolean> => {
  const message = orderData.trackingNumber
    ? `Your order #${orderData.orderNumber} has been shipped! Track it with: ${orderData.trackingNumber}. - Shreejyot Fashion`
    : `Your order #${orderData.orderNumber} has been shipped! It will reach you soon. - Shreejyot Fashion`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.ORDER_SHIPPED,
  });
};

/**
 * Send order delivered SMS
 */
export const sendOrderDeliveredSms = async (
  phoneNumber: string,
  userId: number,
  orderNumber: string
): Promise<boolean> => {
  const message = `Your order #${orderNumber} has been delivered! Thank you for shopping with Shreejyot Fashion. Please rate your experience.`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.ORDER_DELIVERED,
  });
};

/**
 * Send rental confirmation SMS
 */
export const sendRentalConfirmationSms = async (
  phoneNumber: string,
  userId: number,
  rentalData: {
    rentalId: number;
    productName: string;
    startDate: Date;
    endDate: Date;
  }
): Promise<boolean> => {
  const message = `Your rental #${rentalData.rentalId} for ${rentalData.productName} is confirmed! Pickup: ${new Date(rentalData.startDate).toLocaleDateString()}, Return: ${new Date(rentalData.endDate).toLocaleDateString()}. - Shreejyot Fashion`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.RENTAL_CONFIRMATION,
  });
};

/**
 * Send rental reminder SMS
 */
export const sendRentalReminderSms = async (
  phoneNumber: string,
  userId: number,
  rentalData: {
    rentalId: number;
    productName: string;
    endDate: Date;
    daysRemaining: number;
  }
): Promise<boolean> => {
  const message = `Reminder: Your rental #${rentalData.rentalId} for ${rentalData.productName} ends in ${rentalData.daysRemaining} day(s) on ${new Date(rentalData.endDate).toLocaleDateString()}. Please return on time to avoid late fees. - Shreejyot Fashion`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.RENTAL_REMINDER,
  });
};

/**
 * Send payment success SMS
 */
export const sendPaymentSuccessSms = async (
  phoneNumber: string,
  userId: number,
  paymentData: {
    amount: number;
    orderNumber: string;
    transactionId: string;
  }
): Promise<boolean> => {
  const message = `Payment of Rs.${paymentData.amount.toFixed(2)} received for order #${paymentData.orderNumber}. Transaction ID: ${paymentData.transactionId}. Thank you! - Shreejyot Fashion`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.PAYMENT_SUCCESS,
  });
};

/**
 * Send OTP SMS
 */
export const sendOtpSms = async (
  phoneNumber: string,
  otp: string,
  userId?: number
): Promise<boolean> => {
  const message = `Your OTP for Shreejyot Fashion is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`;

  return sendSms({
    to: phoneNumber,
    message,
    userId,
    smsType: SmsType.OTP,
  });
};

export default {
  sendSms,
  sendOrderConfirmationSms,
  sendOrderShippedSms,
  sendOrderDeliveredSms,
  sendRentalConfirmationSms,
  sendRentalReminderSms,
  sendPaymentSuccessSms,
  sendOtpSms,
};
