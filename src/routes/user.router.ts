import express from "express";

import { login, logout, refreshToken } from "../controllers/auth.controller";
import { getUserByEmail, getUsers, registerUser, removeUser, updatePassword, updateUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.get("/user/:email", getUserByEmail);
userRouter.post("/register", registerUser);
userRouter.put("/update", updateUser);
userRouter.put("/update-password", updatePassword);
userRouter.delete("/remove/:email", removeUser);

userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/refreshToken", refreshToken);

export default userRouter;
