import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('YUGABYTE_HOST'),
  port: configService.getOrThrow('YUGABYTE_PORT'),
  database: configService.getOrThrow('YUGABYTE_NAME'),
  username: configService.getOrThrow('YUGABYTE_USER'),
  password: configService.getOrThrow('YUGABYTE_PASSWORD'),
  logging: ['query', 'error'],
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
});
