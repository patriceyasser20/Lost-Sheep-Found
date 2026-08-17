import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_ADDRESS = 'Lost Sheep Found <hello@lostsheepfound.com>';
// Swap to 'onboarding@resend.dev' until your domain is verified.