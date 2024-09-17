"use server";

import Time from "../database/models/time.model";

import { connectToDB } from "../database/mongoose";

export async function reportTime(
  userId: string,
  projectId: string,
  checkIn: boolean
) {
  try {
    connectToDB();

    const time = await Time.findOne({
      user: userId,

      project: projectId,
    });

    if (!time) {
      throw new Error("Time not found");
    }
    if (checkIn) {
      time.checkInTime - Date.now();
    } else {
      time.checkOutTime - Date.now();
    }

    await time.save();

    return true;
  } catch (error) {
    console.log("time.actions: Error reporting time", error);
  }

  return false;
}

export async function getTime(userId: string) {
  try {
    connectToDB();
    const time = await Time.find({
      user: userId,
    });

    if (time) {
      return JSON.parse(JSON.stringify(time));
    }
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
  }

  return [];
}
