import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();

interface IConstants {
  TYPE: 'postgres';
  HOST: string;
  PORT: number;
  POSTGRES_PORT: number;
  USERNAME: string;
  PASSWORD: string;
  DATABASE: string;
}

export const CONSTANTS: IConstants = {
  TYPE: configService.get('TYPE'),
  HOST: configService.get('POSTGRES_HOST'),
  PORT: configService.get('PORT'),
  POSTGRES_PORT: configService.get('POSTGRES_PORT'),
  USERNAME: configService.get('POSTGRES_USER'),
  PASSWORD: configService.get('POSTGRES_PASSWORD'),
  DATABASE: configService.get('POSTGRES_DB'),
};
