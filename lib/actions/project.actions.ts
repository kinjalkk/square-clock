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
          client: { $regex: new RegExp(`^${client}$`, "i") },
        },
        {
          project: { $regex: new RegExp(`^${project}$`, "i") },
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
      client: client.charAt(0).toUpperCase() + client.slice(1).toLowerCase(),
      project: project.charAt(0).toUpperCase() + project.slice(1).toLowerCase(),
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

export async function updateProject(
  projectId: string,
  hours: number,
  client: string,
  project: string
) {
  try {
    connectToDB();
    const updateProject = await Project.findByIdAndUpdate(
      projectId,
      {
        maxTime: hours,
        client: client.charAt(0).toUpperCase() + client.slice(1).toLowerCase(),
        project:
          project.charAt(0).toUpperCase() + project.slice(1).toLowerCase(),
      },
      { new: true }
    );
    if (updateProject) {
      return JSON.parse(JSON.stringify(updateProject));
    } else {
      console.log("Error updating project");
    }
  } catch (error) {
    console.log("project.actions: Error updating project", error);
  }
  return false;
}
