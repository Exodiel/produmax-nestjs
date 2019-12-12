import { ConfigService } from '../config/config.service';

const configService = new ConfigService(`${process.env.NODE_ENV}.env`);

export const JWT_SECRET = configService.jwtSecret;

export const API_SECRET = configService.apiSecret;

export const EXPIRES_IN = configService.expiresIn;
