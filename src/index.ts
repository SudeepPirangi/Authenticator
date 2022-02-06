import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app:Express = express();

app.use(express.json());
app.use(helmet());

app.listen(PORT, () => {
  console.log(`Authenticator app is listening on port ${PORT} in ${ENV} environment`);
  console.log('xyz');
});