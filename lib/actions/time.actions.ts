"use server";

import Project from "../database/models/project.model";
import Time from "../database/models/time.model";
import User from "../database/models/user.model";

import { connectToDB } from "../database/mongoose";

export async function startTime(
  userId: string,
  projectId: string,
  description?:string,
) {
  try {
    connectToDB();
      const newTime=new Time({
        user:userId,
        project:projectId,
        checkinTime:Date.now(),
        description:description||"",
      })
      const createdTime= await newTime.save();
      return createdTime
  } catch (error) {
    console.log("time.actions: Error reporting time", error);
  }
  return false;
}

export async function stopTime(timeId:string){
  try{
    connectToDB()
    const time=await Time.findById(timeId);
    if(time){
      time.checkOutTime=Date.now();
      await time.save();
      return true;
    }
  } catch(error){
    console.log("time.actions: Error stopping time",error);
    
  }
  return false;
}

export async function getTime(userId: string) {
  try {
    connectToDB();
    const time = await Time.find({
      user: userId,
    }).sort({checkInTime:-1});
    if (time) {
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          return{
            ...t.toObject(),
            projectClient:project?.client,
            projectName:project?.project,
            projectMaxTime:project?.maxtime,
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
    const time=await Time.find({}).sort({checkInTime:-1});
    if (time) {
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          const user=await User.findById(t.user).select("username email")
          return{
            ...t.toObject(),
            projectClient:project?.client,
            projectName:project?.project,
            projectMaxTime:project?.maxtime,
            userName:user?.username,
            userEmail:user?.email,
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
      checkInTime:{ $gte: startDate, $lt:new Date(endDate.getTime()+24*60*60*1000)},
    }).sort({checkInTime:-1});
    if (time) {
      const populateTimes= await Promise.all(
        time.map(async (t)=>{
          const project=await Project.findById(t.project).select("client project maxTime");
          const user=await User.findById(t.user).select("username email")
          return{
            ...t.toObject(),
            projectClient:project?.client,
            projectName:project?.project,
            projectMaxTime:project?.maxtime,
            userName:user?.username,
            userEmail:user?.email,
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

export async function getTimeByDateRangeUser(startDate: Date, endDate: Date, userId:string) {
  try {
  connectToDB();
  const time = await Time.find({
    user: userId,
    checkInTime: { $gte: startDate, $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000) }, 
}).sort({ checkInTime: -1 }); 
if (time) {
  const populateTimes = await Promise.all(
  time.map(async (t) => {
  const project = await Project.findById(t.project).select("client project maxTime");
  return {
  ...t.toObject(), 
  projectClient: project?.client, 
  projectName: project?.project, 
  projectMaxTime: project?.maxTime, 
}; 
  }) 
  ); 
  return JSON.parse(JSON.stringify(populateTimes)); 
  }
}
  catch (error) {
  console.log("time.actions: Error fetching time by date range for user", error);
  }
  return [];
}

export async function checkActiveTime(userId:string){
  try{
    connectToDB();
    const activeTime=await Time.findOne({
      user:userId,
      checkOutTime:null,
    });
    if(activeTime){
      return true
    }
    } catch (error){
      console.log("time.action: error fetching active time")
    }
    return false;
}