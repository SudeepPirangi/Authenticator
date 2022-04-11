import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";

import userRouter from "./routes/user.router";
import appointmentsRouter from "./routes/appointments.router";

dotenv.config();

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use(helmet());
app.use("/", userRouter);
app.use("/", appointmentsRouter);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT} in ${ENV} environment`);
  // connectMongo();
  // setTimeout(() => {
  //   disconnectMongo();
  // }, 3000);
});
