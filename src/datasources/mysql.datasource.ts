import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
require('dotenv').config();

const config = {
  name: 'mysql',
  connector: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? + process.env.DB_PORT : '', // Converte la porta in numero
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'mysql'; // Assicurati che questo nome corrisponda
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
