import { DataSource, DataSourceOptions } from 'typeorm';
// import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';

// config();

const configService = new ConfigService();

// needs to forRoot typeOrm module
export const newOrmConfig: DataSourceOptions = {
  type: 'postgres',
  // for using without docker container
  // host: 'localhost',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  // host: configService.get('POSTGRES_HOST'),
  // port: configService.get('POSTGRES_PORT'),
  // username: configService.get('POSTGRES_USER'),
  // password: configService.get('POSTGRES_PASSWORD'),
  // database: configService.get('POSTGRES_DB'),
  entities: [MessageEntity, UserEntity],
  synchronize: true,
};

// needs to migration actions
export const dataSource = new DataSource(newOrmConfig);
