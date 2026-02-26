import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {CognitoAuthenticationStrategy} from './authentication';
import {MysqlDataSource} from './datasources/mysql.datasource';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class BackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Load environment variables
    dotenv.config();

    // Configure CORS
    this.options.rest = {
      ...this.options.rest,
      cors: {
        origin: process.env.CORS_FRONTEND,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
      expressSettings: {
        'x-powered-by': false,
        'trust proxy': false,
      },
    };

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Autenticazione Cognito
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, CognitoAuthenticationStrategy);

    // Configure the MySQL datasource
    this.dataSource(MysqlDataSource);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
