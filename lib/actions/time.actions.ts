"use server";

import Project from "../database/models/project.model";
import Time from "../database/models/time.model";
import User from "../database/models/user.model";

import { connectToDB } from "../database/mongoose";

export async function reportTime(
  userId: string,
  projectId: string,
  description:string,
  checkIn: boolean
) {
  try {
    connectToDB();

    const time = await Time.findOne({
      user: userId,

      project: projectId,
    });

    if (!time) {
      const newTime=new Time({
        user:userId,
        project:projectId,
        checkinTime:Date.now(),
        description:description,
      })
      const createdTime= await newTime.save();
      return createdTime
    }
    if (checkIn) {
      time.checkInTime - Date.now();
    } else {
      time.checkOutTime - Date.now();
    }

    const updatedTime=await time.save();

    return updatedTime;
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
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          return{
            ...t.toObject(),
            project,
          }
        })
      )
      return JSON.parse(JSON.stringify(populateTimes));
    }
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
  }

  return [];
}
export async function getAllTimes() {
  try{
    connectToDB();
    const time=await Time.find({});
    if (time) {
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          const user=await User.findById(t.user).select("username email")
          return{
            ...t.toObject(),
            project,
            user,
          }
        })
      )
      return JSON.parse(JSON.stringify(populateTimes));
    }
  }catch (error){
    console.log("time.actions: Error fetching time",error);
  }
  return [];
}
export async function getTimeByDateRange(startDate:Date,endDate:Date){
  try{
    const time =await Time.find({
      chekInTime:{ $gte: startDate, $lt:endDate},
    });
    if (time) {
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          const user=await User.findById(t.user).select("username email")
          return{
            ...t.toObject(),
            project,
            user,
          }
        })
      )
      return JSON.parse(JSON.stringify(populateTimes));
    }
  } catch(error){
    console.log("time.actions: error fetching time",error);
  }
  return [];
}