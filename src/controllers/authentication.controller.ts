import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { Users, connectMongo, disconnectMongo } from "../util/mongoose";
import { queryDB } from "../helpers/queryDB";
import StandardResponse from "../models/standardResponse.model";
import User from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  const queryResponse = await queryDB(Users.find(), "Get all Users");
  const allUsers: User[] = queryResponse.map((user: any) => {
    return { _id: user._id, email: user.email };
  });
  const getUsersResponse: StandardResponse = {
    status: 200,
    message: "All users information",
    data: allUsers,
  };
  return res.json(getUsersResponse);
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  const queryResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
  const thisUser: User = {
    _id: queryResponse?._id,
    email: queryResponse?.email,
  };
  return res.json(thisUser);
};

export const registerUser = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;
  const hashedPassword = await bcrypt.hash(password, 12);
  if (email.length > 0 && password.length > 0) {
    const queryResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (!queryResponse) {
      let newUser = new Users({
        email,
        password: hashedPassword,
      });
      let registration = await queryDB(newUser.save(), `Save User by email ${email}`);
      return res.json({
        status: 200,
        message: "User registration successful",
        data: {
          _id: registration._id,
          email: registration.email,
        },
      });
    }
    return res.json({
      status: 500,
      message: "Registration failed. User already exists with this email",
      data: { email },
    });
  } else {
    return res.json({
      status: 500,
      message: "Failed to register user, invalid data",
      data: {
        email,
        password,
      },
    });
  }
};

export const loginUser = () => {
  console.log("Login User");
};

export const resetPassword = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const oldPassword = req.body?.oldPassword;
  const newPassword = req.body?.newPassword;
  if (email.length > 0 && oldPassword.length > 0 && newPassword.length > 0) {
    const thisUser = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (thisUser) {
      const passwordsMatch = await bcrypt.compare(oldPassword, thisUser.password);
      console.log("Old Password Matches?", passwordsMatch);
      if (passwordsMatch) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        let updatedUserResponse = await queryDB(
          Users.findByIdAndUpdate(thisUser._id, { password: hashedNewPassword }),
          `Reset password for ${email}`
        );
        if (updatedUserResponse) {
          return res.json({
            status: 200,
            message: "Password reset successful",
            data: { email },
          });
        }
        return res.json({
          status: 500,
          message: "Password reset failed.",
          data: updatedUserResponse,
        });
      }
      return res.json({
        status: 400,
        message: "Password reset failed. Given old password doesn't match.",
        data: { email },
      });
    }
    return res.json({
      status: 400,
      message: "Password reset failed. User doesn't exist with this email",
      data: { email },
    });
  } else {
    return res.json({
      status: 400,
      message: "Failed to reset password, invalid data",
      data: { email },
    });
  }
};

export const removeUser = () => {
  console.log("Remove Users");
};
