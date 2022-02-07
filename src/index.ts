import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";

import authRouter from "./routes/authentication.router";

dotenv.config();

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use(helmet());
app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Authenticator app is listening on port ${PORT} in ${ENV} environment`);
  // connectMongo();
  // setTimeout(() => {
  //   disconnectMongo();
  // }, 3000);
});
