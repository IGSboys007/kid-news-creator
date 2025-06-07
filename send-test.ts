import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    const response = await resend.emails.send({
      from: 'Kid News <test@kidsnewsdaily.news>',
      to: 'jmazzaro@gmail.com',
      subject: 'Test Email from Resend',
      html: '<strong>This is a test email sent from your Kid News Creator project!</strong>',
    });

    console.log('✅ Email sent:', response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

main();
