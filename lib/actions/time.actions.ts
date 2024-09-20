"use server";

import Time from "../database/models/time.model";

import { connectToDB } from "../database/mongoose";

export async function reportTime(
  userId: string,
  userMail:string,
  userName:string,
  projectName:string,
  clientName:string,
  projectId: string,
  description:string,
  maxHours:number,
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
        userName:userName,
        projectName:projectName,
        clientName:clientName,
        userMail:userMail,
        user:userId,
        project:projectId,
        checkinTime:Date.now(),
        description:description,
        maxHours:maxHours
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
      return JSON.parse(JSON.stringify(time));
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
    if(time){
      return JSON.parse(JSON.stringify(time));
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
    if(time){
      return JSON.parse(JSON.stringify(time));
    }
  } catch(error){
    console.log("time.actions: error fetching time",error);
  }
  return [];
}