import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('YUGABYTE_HOST'),
        port: config.getOrThrow('YUGABYTE_PORT'),
        database: config.getOrThrow('YUGABYTE_NAME'),
        username: config.getOrThrow('YUGABYTE_USER'),
        password: config.getOrThrow('YUGABYTE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
