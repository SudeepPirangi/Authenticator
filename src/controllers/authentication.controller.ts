import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { Users, connectMongo, disconnectMongo } from "../util/mongoose";
import { queryDB } from "../helpers/queryDB";
import StandardResponse from "../models/standardResponse.model";
import User from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  const queryResponse = await queryDB(Users.find(), "Get all Users");
  const allUsers: User[] = queryResponse.map((user: any) => {
    let userCopy = JSON.parse(JSON.stringify(user));
    delete userCopy.password;
    return userCopy;
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
  if (email) {
    const queryResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (queryResponse) {
      let userCopy = JSON.parse(JSON.stringify(queryResponse));
      delete userCopy.password;
      return res.json({
        status: 400,
        message: `Failed to get user. User doesn't exist with email ${email}`,
        data: userCopy,
      });
    }
    return res.json({
      status: 400,
      message: `Failed to get user. User doesn't exist with email ${email}`,
      data: email,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to get user, invalid email",
    data: email,
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const firstname = req.body?.firstname;
  const lastname = req.body?.lastname;
  const email = req.body?.email;
  const password = req.body?.password;
  const role = req.body?.role;

  const data = {
    firstname,
    lastname,
    email,
    password,
    role,
  };

  if (email.length > 0 && password.length > 0) {
    const queryResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (!queryResponse) {
      data.password = await bcrypt.hash(password, 12);
      await connectMongo();
      let newUser = new Users(data);
      let registeredUser = await queryDB(newUser.save(), `Save User by email ${email}`);
      registeredUser = JSON.parse(JSON.stringify(registeredUser));
      delete registeredUser.password;
      return res.json({
        status: 200,
        message: "User registration successful",
        data: registeredUser,
      });
    }
    return res.json({
      status: 500,
      message: "Registration failed. User already exists with this email",
      data,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to register user, invalid data",
    data,
  });
};

export const loginUser = () => {
  console.log("Login User");
};

export const updateUser = async (req: Request, res: Response) => {
  const firstname = req.body?.firstname;
  const lastname = req.body?.lastname;
  const email = req.body?.email;
  const role = req.body?.role ?? "default";

  const commonData = { firstname, lastname, email, role };

  if (firstname.length > 0 && lastname.length > 0 && email.length > 0) {
    const thisUser = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (thisUser) {
      let updatedUserResponse = await queryDB(Users.findByIdAndUpdate(thisUser._id, commonData), `Update user for ${email}`);
      if (updatedUserResponse) {
        updatedUserResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
        updatedUserResponse = JSON.parse(JSON.stringify(updatedUserResponse));
        delete updatedUserResponse.password;
        return res.json({
          status: 200,
          message: "Updating user is successful",
          data: updatedUserResponse,
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
      message: `Password reset failed. User doesn't exist with the email ${email}`,
      data: commonData,
    });
  }
  return res.json({
    status: 400,
    message: "Failed to update user, invalid data",
    data: commonData,
  });
};

export const updatePassword = async (req: Request, res: Response) => {
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
            data: email,
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
        data: email,
      });
    }
  } else {
    return res.json({
      status: 400,
      message: "Failed to reset password, invalid data",
      data: email,
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  const email = req.params.email;
  if (email) {
    const queryResponse = await queryDB(Users.findOne({ email }), `Get User by email ${email}`);
    if (queryResponse) {
      const deleteUserResponse = await queryDB(Users.deleteOne({ email }));
      return res.json({
        status: 200,
        message: `Delete user ${email}`,
        data: deleteUserResponse,
      });
    }
    return res.json({
      status: 400,
      message: `Failed to get user. User doesn't exist with email ${email}`,
      data: email,
    });
  }
  return res.json({
    status: 500,
    message: "Failed to remove user, invalid email",
    data: email,
  });
};
