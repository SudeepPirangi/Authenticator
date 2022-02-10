import mongoose from "mongoose";

import UsersSchema from "../models/Users.schema";

let ENV_VAR = process.env;

export const Users = mongoose.model("Users", UsersSchema);

export const connectMongo = () => {
  return mongoose.connect(
    `mongodb+srv://${ENV_VAR.MONGODB_USERNAME}:${ENV_VAR.MONGODB_PASSWORD}@${ENV_VAR.MONGODB_HOST}/${ENV_VAR.MONGODB_DATABASE}`
  );
};

export const disconnectMongo = () => {
  return mongoose.connection.close();
};

mongoose.connection.on("error", (err) => {
  console.log("==> MongoDB error ", err);
});
mongoose.connection.on("connected", (data) => {
  console.log("==> MongoDB connected");
});
mongoose.connection.on("disconnected", (data) => {
  console.log("==> MongoDB disconnected");
});
