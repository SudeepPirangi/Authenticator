import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie";

import { queryDB } from "../helpers/queryDB";
import { Users } from "../util/mongoose";

dotenv.config();
const ENV_VAR: any = process.env;

export const login = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;
  const data = { email, password };
  if (email.length > 0 && password.length > 0) {
    let user = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      console.log("Passwords Match?", passwordsMatch);
      if (passwordsMatch) {
        user = JSON.parse(JSON.stringify(user));
        delete user.password;
        const tokenExpiresIn: number = ENV_VAR.TOKEN_EXPIRES_IN ?? parseInt(ENV_VAR.TOKEN_EXPIRES_IN);
        const refreshExpiresIn: number = ENV_VAR.REFRESH_EXPIRES_IN ?? parseInt(ENV_VAR.REFRESH_EXPIRES_IN);
        const accessToken = jwt.sign(user, ENV_VAR.TOKEN_SECRET, { expiresIn: `${tokenExpiresIn}ms` });
        const refreshToken = jwt.sign(user, ENV_VAR.REFRESH_SECRET, { expiresIn: `${refreshExpiresIn}ms` });
        return res
          .setHeader("Set-Cookie", [
            cookie.serialize("tkn", accessToken, { httpOnly: true, maxAge: tokenExpiresIn / 1000 }),
            cookie.serialize("ref", refreshToken, { httpOnly: true, maxAge: refreshExpiresIn / 1000 }),
          ])
          .json({
            status: 200,
            message: "Authentication Successful",
            data: { email, accessToken, refreshToken },
          });
      }
      return res.json({
        status: 400,
        message: "Login failed. Password doesn't match.",
        data,
      });
    }
    return res.json({
      status: 500,
      message: `Login failed. User doesn't exist with this email ${email}`,
      data,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to login user, invalid data",
    data,
  });
};

export const logout = async (req: Request, res: Response) => {
  const accessToken = req.header("accessToken");
  if (accessToken) {
    let decodedToken: any = await jwt.verify(accessToken, ENV_VAR.TOKEN_SECRET);
    if (decodedToken["exp"] < Date.now()) {
      return res.setHeader("Set-Cookie", [cookie.serialize("tkn", "", { httpOnly: true }), cookie.serialize("ref", "", { httpOnly: true })]).json({
        status: 200,
        message: "Logout successful",
        data: {
          email: decodedToken["email"],
          accessToken: null,
          refreshToken: null,
        },
      });
    }
    return res.json({
      status: 200,
      message: "Access token has already expired",
      data: null,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to logout user. Missing access token in header",
    data: null,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.header("refreshToken");
  if (refreshToken) {
    let decodedToken: any = await jwt.verify(refreshToken, ENV_VAR.REFRESH_SECRET);
    if (decodedToken["exp"] < Date.now()) {
      delete decodedToken["iat"];
      delete decodedToken["exp"];
      const tokenExpiresIn: number = ENV_VAR.TOKEN_EXPIRES_IN ?? parseInt(ENV_VAR.TOKEN_EXPIRES_IN);
      const refreshExpiresIn: number = ENV_VAR.REFRESH_EXPIRES_IN ?? parseInt(ENV_VAR.REFRESH_EXPIRES_IN);
      const newAccessToken = await jwt.sign(decodedToken, ENV_VAR.TOKEN_SECRET, { expiresIn: `${tokenExpiresIn}ms` });
      const newRefreshToken = await jwt.sign(decodedToken, ENV_VAR.REFRESH_SECRET, { expiresIn: `${refreshExpiresIn}ms` });
      return res
        .setHeader("Set-Cookie", [
          cookie.serialize("tkn", newAccessToken, { httpOnly: true, maxAge: tokenExpiresIn / 1000 }),
          cookie.serialize("ref", newRefreshToken, { httpOnly: true, maxAge: refreshExpiresIn / 1000 }),
        ])
        .json({
          status: 200,
          message: "Refresh token is successful",
          data: {
            email: decodedToken["email"],
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        });
    }
    return res.json({
      status: 500,
      message: "Token expired, login again",
      data: null,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to refresh token. Missing refresh token in header",
    data: null,
  });
};
