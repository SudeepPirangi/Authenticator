import mongoose from "mongoose";

let ENV = process.env;
let mongodb = null;

const UsersSchema = new mongoose.Schema({ email: "string", password: "string" });
export const Users = mongoose.model("Users", UsersSchema);

export const connectMongo = () => {
  return mongoose.connect(`mongodb+srv://${ENV.MONGODB_USERNAME}:${ENV.MONGODB_PASSWORD}@${ENV.MONGODB_HOST}/${ENV.MONGODB_DATABASE}`);
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
