import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getEnv(key: string, defaultValue: string = ''): string {
  const value = process.env[key]?.trim();
  return value || defaultValue;
}

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  amazon: {
    clientId: getEnv('AMAZON_CLIENT_ID', 'amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxx'),
    clientSecret: getEnv('AMAZON_CLIENT_SECRET', 'amzn1.oa2-cs.v1.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    redirectUri: getEnv('AMAZON_REDIRECT_URI', 'http://localhost:3000/api/auth/amazon/callback'),
    adsApiBase: getEnv('AMAZON_ADS_API_BASE', 'https://advertising-api-eu.amazon.com'),
    authUrl: getEnv('AMAZON_AUTH_URL', 'https://eu.account.amazon.com/ap/oa'),
    tokenUrl: getEnv('AMAZON_TOKEN_URL', 'https://api.amazon.com/auth/o2/token'),
  },
};
