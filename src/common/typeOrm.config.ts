import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { PrivateMessageEntity } from 'src/messages/entities/privateMessage.entity';

import { CONSTANTS } from './constants';

// needs to forRoot typeOrm module
export const newOrmConfig: DataSourceOptions = {
  type: CONSTANTS.TYPE,
  host: CONSTANTS.HOST,
  port: CONSTANTS.PORT,
  username: CONSTANTS.USERNAME,
  password: CONSTANTS.PASSWORD,
  database: CONSTANTS.DATABASE,
  entities: [MessageEntity, UserEntity, PrivateMessageEntity],
  synchronize: true,
};

// needs to migration actions
export const dataSource = new DataSource(newOrmConfig);
