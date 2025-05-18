import 'dotenv/config';
import pino from 'pino-http';
import cors from 'cors';
import express from 'express';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

export default async function setupServer() {
  console.log('setupServer is running...');

  app.use('/', contactsRouter);
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);
  //serv

  try {
    const PORT = process.env.PORT || 3000;
    await initMongoConnection();

    app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
  //serv
}

// export default app;
