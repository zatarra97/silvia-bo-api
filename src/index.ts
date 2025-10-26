import * as dotenv from 'dotenv';
import * as path from 'path';
import { ApplicationConfig, BackendApplication } from './application';
import { IkeaApiService } from './services/ikea-api.service';

// Carica le variabili d'ambiente dal file .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new BackendApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  // Avvia il cron job per la ricerca Ikea ogni 5 minuti
  // Inietta il repository dal context dell'app
  const IkeaOfferRepositoryClass = (await import('./repositories/ikea-offer.repository')).IkeaOfferRepository;
  const ikeaOfferRepository = await app.getRepository(IkeaOfferRepositoryClass);
  const ikeaService = new IkeaApiService(ikeaOfferRepository);
  ikeaService.startScheduledSearch();

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3005),
      host: process.env.HOST || '127.0.0.1',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
