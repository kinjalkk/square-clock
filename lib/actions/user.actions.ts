"use server";

import User from "../database/models/user.model";
import { connectToDB } from "../database/mongoose";
import bcrypt from "bcrypt";

export async function getUserByEmail(email: string): Promise<boolean> {
  try {
    connectToDB();
    const user = await User.findOne({
      email: { $regex:new RegExp(`^${email}$`,"i") },
    });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("user.actions:Error fetching user", error);
  }
  return false;
}

export async function getUserByUsername(username: string): Promise<boolean> {
  try {
    connectToDB();
    const user = await User.findOne({
      username: { $regex:new RegExp(`^${username}$`,"i") },
    });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("user.actions:Error fetching user", error);
  }
  return false;
}

export async function getUserByEmailOrUsername(
  username: string
): Promise<boolean> {
  try {
    connectToDB();
    const user = await User.findOne({
      $or: [
        {
          email: { $regex:new RegExp(`^${username}$`,"i") },
        },
        {
          username: { $regex:new RegExp(`^${username}$`,"i") },
        },
      ],
    });
    if (user) return true;
    return false;
  } catch (error) {
    console.log("user.actions:Error fetching user", error);
  }
  return false;
}

export async function registerUser(
  email: string,
  password: string,
  username: string
) {
  try {
    connectToDB();
    if (!email || !password) {
      throw new Error("Email or password missing");
    }
    const salt = 12;

    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username.toLowerCase(),
      isAdmin: false,
    });

    if (user) {
      return JSON.parse(JSON.stringify(user));
    } else {
      console.log("Error creating User");
    }
  } catch (error) {
    console.log("user.actions:Error creating user", error);
  }
}

export async function login(username: string, password: string) {
  try {
    connectToDB();
    if (!username || !password) {
      throw new Error("Missing login credentails");
    }
    const user = await User.findOne({
      $or: [
        {
          email: { $regex:new RegExp(`^${username}$`,"i") },
        },
        {
          username: { $regex:new RegExp(`^${username}$`,"i") },
        },
      ],
    });
    let passwordMatch;
    if (user) {
      passwordMatch = await bcrypt.compare(password, user.password);
    }
    if (passwordMatch) {
      return JSON.parse(JSON.stringify(user));
    } else {
      return false;
    }
  } catch (error) {}
}

export async function updatePassword(email: string, password: string) {
  try {
    connectToDB();

    const salt = 12;

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      {
        email: { $regex:new RegExp(`^${email}$`,"i") },
      },
      {
        password: hashedPassword,
      }
    );

    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("user.actions: Error updating password", error);
  }
}

export async function getAllUsers(){
  try{
      connectToDB();
      const users=await User.find({},'username');
      return users;
  } catch (error){
    console.log("user.actions: Error fetching users",error);
    
  }
}