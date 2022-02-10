import express from "express";

import { getUserByEmail, getUsers, loginUser, registerUser, removeUser, updatePassword, updateUser } from "../controllers/authentication.controller";

const authRouter = express.Router();

authRouter.get("/users", getUsers);
authRouter.get("/user/:email", getUserByEmail);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/update", updateUser);
authRouter.put("/update-password", updatePassword);
authRouter.delete("/remove/:email", removeUser);

export default authRouter;
