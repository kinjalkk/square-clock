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
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const endDate = new Date();

    // Fetch all times for the user in one query
    const time = await Time.find({
      user: userId,

      checkinTime: {
        $gte: oneYearAgo,
        $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .sort({ checkintime: -1 })
      .lean();

    if (time.length === 0) return [];

    // Collect unique project IDs

    const projectIds = [...new Set(time.map((t) => t.project?.toString()))];

    // Fetch all projects in bulk

    const projects = await Project.find({ _id: { $in: projectIds } })
      .select("client project maxTime")
      .lean();

    // Create lookup map

    const projectMap = new Map(projects.map((p) => [p._id.toString(), p]));

    // Populate times

    const results = time.map((t) => ({
      ...t,
      projectClient: projectMap.get(t.project?.toString())?.client,
      projectName: projectMap.get(t.project?.toString())?.project,
      projectMaxTime: projectMap.get(t.project?.toString())?.maxTime,
    }));

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
  }
  return [];
}

export async function getAllTimes() {
  try{
    connectToDB();
    const thirtyDaysAgo=new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() -30);
    const time = await Time.find({
      checkinTime: {
        $gte: thirtyDaysAgo
      }
    })
      .sort({ checkintime: -1 })
      .lean();
    if (time.length === 0) return [];

    // Collect unique project IDs

    const projectIds = [...new Set(time.map((t) => t.project?.toString()))];

    const userIds=[...new Set(time.map((t) => t.user?.toString()))]

    const projects = await Project.find({ _id: { $in: projectIds } })
      .select("client project maxTime")
      .lean();
const users = await User.find({ _id: { $in: userIds } })
      .select("username email")
      .lean();
    // Create lookup map

    const projectMap = new Map(projects.map((p) => [p._id.toString(), p]));
    const userMap = new Map(projects.map((u) => [u._id.toString(), u]));


    // Populate times

    const results = time.map((t) => ({
      ...t,
      projectClient: projectMap.get(t.project?.toString())?.client,
      projectName: projectMap.get(t.project?.toString())?.project,
      projectMaxTime: projectMap.get(t.project?.toString())?.maxTime,
      userName:userMap.get(t.user?.toString())?.username,
      userEmail:userMap.get(t.user?.toString())?.email,
    }));

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
  }
  return [];
}
export async function getTimeByDateRange(startDate:Date,endDate:Date){
  try{
    connectToDB();
    const time = await Time.find({
      checkinTime: {
        $gte: startDate,
        $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .sort({ checkintime: -1 })
      .lean();
    if (time.length === 0) return [];

    // Collect unique project IDs

    const projectIds = [...new Set(time.map((t) => t.project?.toString()))];

    const userIds=[...new Set(time.map((t) => t.user?.toString()))]

    const projects = await Project.find({ _id: { $in: projectIds } })
      .select("client project maxTime")
      .lean();
const users = await User.find({ _id: { $in: userIds } })
      .select("username email")
      .lean();
    // Create lookup map

    const projectMap = new Map(projects.map((p) => [p._id.toString(), p]));
    const userMap = new Map(projects.map((u) => [u._id.toString(), u]));


    // Populate times

    const results = time.map((t) => ({
      ...t,
      projectClient: projectMap.get(t.project?.toString())?.client,
      projectName: projectMap.get(t.project?.toString())?.project,
      projectMaxTime: projectMap.get(t.project?.toString())?.maxTime,
      userName:userMap.get(t.user?.toString())?.username,
      userEmail:userMap.get(t.user?.toString())?.email,
    }));

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
  }
  return [];
}

export async function getTimeByDateRangeUser(startDate: Date, endDate: Date, userId:string) {
  try {
  connectToDB();
  const time = await Time.find({
      user: userId,

      checkinTime: {
        $gte: startDate,
        $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .sort({ checkintime: -1 })
      .lean();

    if (time.length === 0) return [];

    // Collect unique project IDs

    const projectIds = [...new Set(time.map((t) => t.project?.toString()))];

    // Fetch all projects in bulk

    const projects = await Project.find({ _id: { $in: projectIds } })
      .select("client project maxTime")
      .lean();

    // Create lookup map

    const projectMap = new Map(projects.map((p) => [p._id.toString(), p]));

    // Populate times

    const results = time.map((t) => ({
      ...t,
      projectClient: projectMap.get(t.project?.toString())?.client,
      projectName: projectMap.get(t.project?.toString())?.project,
      projectMaxTime: projectMap.get(t.project?.toString())?.maxTime,
    }));

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.log("time.actions: Error fetching time", error);
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
