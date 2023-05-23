import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { MessageEntity } from '../websocket/messages/entities/message.entity';
import { PrivateMessageEntity } from '../websocket/messages/entities/privateMessage.entity';

import { CONSTANTS } from './constants';
import { NewMigration } from '../../migrations/NewMigration';

// needs to forRoot typeOrm module
export const newOrmConfig: DataSourceOptions = {
  type: CONSTANTS.TYPE,
  host: CONSTANTS.HOST,
  port: CONSTANTS.POSTGRES_PORT,
  username: CONSTANTS.USERNAME,
  password: CONSTANTS.PASSWORD,
  database: CONSTANTS.DATABASE,
  entities: [MessageEntity, UserEntity, PrivateMessageEntity],
  migrations: [NewMigration],
};

// needs to migration actions
export const dataSource = new DataSource(newOrmConfig);
