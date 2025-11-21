import nodemailer from 'nodemailer';

interface NotificationPayload {
  type: 'CONFIRMATION' | 'CANCELLATION' | 'OWNER_ALERT';
  recipient: string;
  data: any;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendEmail(to: string, subject: string, html: string, attachments: any[] = []) {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      attachments
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email failed', error);
  }
}

export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    console.log(`Telegram sent`);
  } catch (error) {
    console.error('Telegram failed', error);
  }
}
