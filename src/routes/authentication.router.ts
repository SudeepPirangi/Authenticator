import express from "express";

import { getUserByEmail, getUsers, loginUser, registerUser, removeUser, resetPassword } from "../controllers/authentication.controller";

const authRouter = express.Router();

authRouter.get("/users", getUsers);
authRouter.get("/user/:email", getUserByEmail);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/reset-password", resetPassword);
authRouter.delete("/remove/:id", removeUser);

export default authRouter;
