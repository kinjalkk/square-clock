"use server";

import Project from "../database/models/project.model";
import { connectToDB } from "../database/mongoose";
import bcrypt from "bcrypt";

export async function getProject(
  client: string,
  project: string
): Promise<boolean> {
  try {
    connectToDB();
    const projectFound = await Project.findOne({
      $and: [
        {
          client: client,
        },
        {
          project: project,
        },
      ],
    });
    if (projectFound) return true;
    return false;
  } catch (error) {
    console.log("user.actions:Error fetching project", error);
  }
  return false;
}

export async function createNewProject(
  client: string,
  project: string,
  hours: number
) {
  try {
    connectToDB();
    if (!client || !project || !hours) {
      throw new Error("Client or Project or Hours missing");
    }

    const newProject = await Project.create({
      client: client,
      project: project,
      maxTime: hours,
    });

    if (newProject) {
      return JSON.parse(JSON.stringify(newProject));
    } else {
      console.log("Error creating Project");
    }
  } catch (error) {
    console.log("project.actions:Error creating project", error);
  }
}
export async function getAllProjects(client: string) {
  try {
    connectToDB();

    const projects = await Project.find({
      client: client,
    });

    if (projects) {
      return JSON.parse(JSON.stringify(projects));
    } else {
      console.log("Error fetching projects");
    }
  } catch (error) {
    console.log("project.actions: Error fetching projects", error);
  }
}

export async function getAllClients() {
  try {
    connectToDB();
    const clients = await Project.distinct("client");
    if (clients) {
      return JSON.parse(JSON.stringify(clients));
    } else {
      console.log("Error fetching clients");
    }
  } catch (error) {
    console.log("project.actions: Error fetching clients", error);
  }
}
