import { SeederOptions } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export enum DatabaseSSLMode {
  require = 'require',
  disable = 'disable',
}

export type DatabaseConfig = PostgresConnectionOptions & SeederOptions;
