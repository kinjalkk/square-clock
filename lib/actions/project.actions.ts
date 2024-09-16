"use server";

import Project from "../database/models/project.model";
import { connectToDB } from "../database/mongoose";
import bcrypt from "bcrypt"




export async function getProject(client: string,project:string): Promise<boolean> {
  try {
    connectToDB();
    const projectFound = await Project.findOne({
      $and: [{
        client: client
      },
      {
        project: project
      }
    ]
    })
    if(projectFound) return true;
    return false
  } catch (error) {
    console.log("user.actions:Error fetching project", error);
  }
  return false
}

export async function createNewProject(client: string, project: string, hours: number){
  try {
    connectToDB();
    if(!client || !project || !hours){
      throw new Error("Client or Project or Hours missing")
    }

    const newProject = await Project.create({
      client: client,
      project: project,
      maxTime: hours,
    })

    if(newProject){
      return JSON.parse(JSON.stringify(newProject));
    } else {
      console.log("Error creating Project")
    }
  } catch (error) {
    console.log("project.actions:Error creating project", error);
  }
}


