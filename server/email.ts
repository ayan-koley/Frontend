import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import { storage } from './storage';

type UserRecord = {
  id: string;
  name?: string | null;
  email: string;
  role?: string | null;
  country?: string | null;
  state?: string | null;
  address?: string | null;
  pin_code?: string | null;
  mobile_number?: string | null;
};

async function createPdfBuffer(user: UserRecord, subscriptionPlan: string) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.fontSize(18).text('STEMQuiz - Registration Confirmation', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${user.name || ''}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Role: ${user['role'] ?? ''}`);
  doc.text(`Country: ${user.country || ''}`);
  doc.text(`State: ${user.state || ''}`);
  doc.text(`Address: ${user.address || ''}`);
  doc.text(`Pin Code: ${user.pin_code || ''}`);
  doc.text(`Mobile Number: ${user.mobile_number || ''}`);
  doc.moveDown();
  doc.text(`Selected plan: ${subscriptionPlan}`);

  doc.moveDown(2);
  doc.fontSize(10).text('Thank you for registering with STEMQuiz. This document summarizes the details you submitted during registration.');

  doc.end();

  // Convert stream to buffer
  const buffer = await getStream.buffer(doc as any);
  return buffer;
}

export async function sendRegistrationConfirmation(userId: string, subscriptionPlan: string) {
  // Load SMTP config from env
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!host || !port || !user || !pass || !from) {
    throw new Error('SMTP environment variables are not fully configured');
  }

  // Fetch user details from storage (DB)
  const userRecord = await storage.getUser(userId);
  if (!userRecord) throw new Error('User not found');

  const pdfBuffer = await createPdfBuffer(userRecord as unknown as UserRecord, subscriptionPlan);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from,
    to: userRecord.email,
    subject: 'STEMQuiz — Registration Confirmed',
    text: `Hi ${userRecord.name || ''},\n\nThank you for registering on STEMQuiz. Attached is a PDF with the details you submitted and your chosen plan: ${subscriptionPlan}.\n\nRegards,\nSTEMQuiz Team`,
    attachments: [
      {
        filename: 'STEMQuiz-registration.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export default sendRegistrationConfirmation;
