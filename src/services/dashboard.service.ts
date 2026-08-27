import { getProjects } from "./projects.service";
import { getSkills } from "./skills.service";
import { getRoles } from "./roles.service";
import { getCertifications } from "./certifications.service";

export interface DashboardStats {
  projects: number;
  skills: number;
  roles: number;
  certifications: number;
  messages: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      projects,
      skills,
      roles,
      certifications,
    ] = await Promise.all([
      getProjects(),
      getSkills(),
      getRoles(),
      getCertifications(),
    ]);

    return {
      projects: projects.length,
      skills: skills.length,
      roles: roles.length,
      certifications: certifications.length,
      messages: 0,
    };
  } catch (error) {
    console.error(
      "Error getting dashboard stats:",
      error
    );

    return {
      projects: 0,
      skills: 0,
      roles: 0,
      certifications: 0,
      messages: 0,
    };
  }
}