import nodemailer, { Transporter } from 'nodemailer';
import EmailLog, { EmailStatus, EmailType } from '../models/EmailLog';
import logger from '../utils/logger';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@shreejyotfashion.com';

// Create transporter
let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter as Transporter;
};

// Email sending interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  userId?: number;
  emailType: EmailType;
}

/**
 * Send email and log to database
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // If email credentials not configured, log but don't fail
    if (!EMAIL_USER || !EMAIL_PASS) {
      logger.warn('Email credentials not configured, skipping email send');
      
      // Log to database as failed
      await EmailLog.create({
        user_id: options.userId || null,
        email_to: options.to,
        email_subject: options.subject,
        email_body: options.html,
        email_type: options.emailType,
        status: EmailStatus.FAILED,
        error_message: 'Email credentials not configured',
      });
      
      return false;
    }

    const transport = getTransporter();

    const mailOptions = {
      from: `Shreejyot Fashion <${EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    };

    // Send email
    const info = await transport.sendMail(mailOptions);

    logger.info(`Email sent: ${info.messageId}`);

    // Log success to database
    await EmailLog.create({
      user_id: options.userId || null,
      email_to: options.to,
      email_subject: options.subject,
      email_body: options.html,
      email_type: options.emailType,
      status: EmailStatus.SENT,
      sent_at: new Date(),
    });

    return true;
  } catch (error: any) {
    logger.error('Error sending email:', error);

    // Log failure to database
    await EmailLog.create({
      user_id: options.userId || null,
      email_to: options.to,
      email_subject: options.subject,
      email_body: options.html,
      email_type: options.emailType,
      status: EmailStatus.FAILED,
      sent_at: new Date(),
      error_message: error.message,
    });

    return false;
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  userId: number,
  orderData: {
    orderId: number;
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }
): Promise<boolean> => {
  const subject = `Order Confirmation - #${orderData.orderNumber}`;
  
  const itemsHtml = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="color: #007bff; margin: 0;">Order Confirmed! 🎉</h1>
      </div>
      
      <p>Thank you for your order! Your purchase has been confirmed.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order Details</h2>
        <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      </div>
      
      <h3>Items Ordered:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="background-color: #f8f9fa; font-weight: bold;">
            <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
            <td style="padding: 10px; text-align: right;">₹${orderData.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Shipping Address</h3>
        <p>${orderData.shippingAddress}</p>
      </div>
      
      <p>We'll send you another email when your order ships.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If you have any questions, please contact us at support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    emailType: EmailType.ORDER_CONFIRMATION,
  });
};

/**
 * Send rental confirmation email
 */
export const sendRentalConfirmationEmail = async (
  email: string,
  userId: number,
  rentalData: {
    rentalId: number;
    productName: string;
    startDate: Date;
    endDate: Date;
    rentalPrice: number;
    securityDeposit: number;
  }
): Promise<boolean> => {
  const subject = `Rental Confirmed - ${rentalData.productName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rental Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0;">Rental Confirmed! 👗</h1>
      </div>
      
      <p>Your rental booking has been confirmed!</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Rental Details</h2>
        <p><strong>Rental ID:</strong> ${rentalData.rentalId}</p>
        <p><strong>Product:</strong> ${rentalData.productName}</p>
        <p><strong>Rental Period:</strong></p>
        <ul>
          <li>Start Date: ${new Date(rentalData.startDate).toLocaleDateString()}</li>
          <li>End Date: ${new Date(rentalData.endDate).toLocaleDateString()}</li>
        </ul>
        <p><strong>Rental Price:</strong> ₹${rentalData.rentalPrice.toFixed(2)}</p>
        <p><strong>Security Deposit:</strong> ₹${rentalData.securityDeposit.toFixed(2)}</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Important Reminders</h3>
        <ul>
          <li>Please collect the item on the start date</li>
          <li>Return the item in good condition before the end date</li>
          <li>Late returns may incur additional charges</li>
          <li>Security deposit will be refunded after inspection</li>
        </ul>
      </div>
      
      <p>We'll send you a reminder before your rental period ends.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Questions? Contact us at support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    emailType: EmailType.RENTAL_CONFIRMATION,
  });
};

/**
 * Send rental reminder email
 */
export const sendRentalReminderEmail = async (
  email: string,
  userId: number,
  rentalData: {
    rentalId: number;
    productName: string;
    endDate: Date;
    daysRemaining: number;
  }
): Promise<boolean> => {
  const subject = `Rental Reminder - Return ${rentalData.productName} Soon`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rental Reminder</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffc107; color: #333; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0;">Rental Reminder ⏰</h1>
      </div>
      
      <p>This is a reminder that your rental period is ending soon.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Rental Information</h2>
        <p><strong>Rental ID:</strong> ${rentalData.rentalId}</p>
        <p><strong>Product:</strong> ${rentalData.productName}</p>
        <p><strong>Return Date:</strong> ${new Date(rentalData.endDate).toLocaleDateString()}</p>
        <p style="color: #dc3545; font-weight: bold;">Days Remaining: ${rentalData.daysRemaining}</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Please Remember</h3>
        <ul>
          <li>Return the item before ${new Date(rentalData.endDate).toLocaleDateString()}</li>
          <li>Late returns will incur additional charges</li>
          <li>Ensure the item is clean and in good condition</li>
        </ul>
      </div>
      
      <p>If you need to extend your rental period, please contact us immediately.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Questions? Contact us at support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    emailType: EmailType.RENTAL_REMINDER,
  });
};

/**
 * Send payment success email
 */
export const sendPaymentSuccessEmail = async (
  email: string,
  userId: number,
  paymentData: {
    transactionId: string;
    amount: number;
    orderNumber: string;
    paymentMethod: string;
    paymentDate: Date;
  }
): Promise<boolean> => {
  const subject = `Payment Successful - ₹${paymentData.amount.toFixed(2)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0;">Payment Successful! ✓</h1>
      </div>
      
      <p>Your payment has been processed successfully.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Payment Details</h2>
        <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
        <p><strong>Amount Paid:</strong> ₹${paymentData.amount.toFixed(2)}</p>
        <p><strong>Order Number:</strong> ${paymentData.orderNumber}</p>
        <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
        <p><strong>Date:</strong> ${new Date(paymentData.paymentDate).toLocaleString()}</p>
      </div>
      
      <p>A receipt has been generated for your records.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Keep this email for your records. For support, contact support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    emailType: EmailType.PAYMENT_SUCCESS,
  });
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (
  email: string,
  userId: number,
  userName: string
): Promise<boolean> => {
  const subject = 'Welcome to Shreejyot Fashion! 🎉';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Shreejyot Fashion</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #007bff; color: white; padding: 30px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
        <h1 style="margin: 0;">Welcome to Shreejyot Fashion!</h1>
      </div>
      
      <p>Hi ${userName},</p>
      
      <p>Thank you for joining Shreejyot Fashion! We're excited to have you as part of our community.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">What's Next?</h2>
        <ul>
          <li>Browse our latest collection of ethnic wear</li>
          <li>Rent designer outfits for special occasions</li>
          <li>Enjoy exclusive member discounts</li>
          <li>Track your orders and rentals</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Start Shopping
        </a>
      </div>
      
      <p>If you have any questions, our support team is always here to help!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Need help? Contact us at support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    userId,
    emailType: EmailType.WELCOME,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #dc3545; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="margin: 0;">Password Reset Request</h1>
      </div>
      
      <p>Hi ${userName},</p>
      
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">${resetUrl}</p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Security Note:</strong></p>
        <ul style="margin: 10px 0;">
          <li>This link will expire in 1 hour</li>
          <li>If you didn't request this, please ignore this email</li>
          <li>Never share this link with anyone</li>
        </ul>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If you have concerns, contact us at support@shreejyotfashion.com
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    emailType: EmailType.PASSWORD_RESET,
  });
};

export default {
  sendEmail,
  sendOrderConfirmationEmail,
  sendRentalConfirmationEmail,
  sendRentalReminderEmail,
  sendPaymentSuccessEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
