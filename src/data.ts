import { fetchRepoDetails, checkIsContributor, extractRepoInfoFromUrl } from '@utils/github';

export interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
  fetchedTechnologies?: string[];
  stars?: number;
  forks?: number;
  isContributor?: boolean;
}

export const siteConfig: {
  skills: {
    title: string;
    items: { name: string; description: string }[];
  };
  projects: {
    title: string;
    items: Project[];
  };
  contact: {
    title: string;
    message: string;
    discord: string;
  };
  footer: {
    socialLinks: { platform: string; url: string }[];
  };
  githubUsername: string;
} = {
  skills: {
    title: "My Skills",
    items: [
      { 
        name: "Frontend",
        description: "Javascript, Typescript, React, Svelte" 
      },
      { 
        name: "Backend",
        description: "Node.js"
      },
      { 
        name: "Network",
        description: "(Ongoing) Network Associate"
      },
      { 
        name: "Databases",
        description: "MySQL/MariaDB" 
      },
      { 
        name: "Languages",
        description: "German (Native), English (Fluent), Spanish (Intermediate)" 
      }
    ]
  },
  
  projects: {
    title: "Projects",
    items: [
      {
        title: "esx-vscode",
        description: "A VSCode extension for FiveM ESX developers.",
        technologies: ["VSCode Extension"],
        link: "https://github.com/RealKnoblauchbrot/esx-vscode"
      },
      {
        title: "ESX Framework",
        description: "A framework for easily creating Roleplay servers.",
        link: "https://github.com/esx-framework/esx_core",
        isContributor: true,
      }
    ]
  },
  
  contact: {
    title: "Get in Touch",
    message: "If you are interested in collaborating or have any questions, feel free to reach out!",
    discord: "https://discord.com/channels/@me/285165039621505044"
  },
  
  footer: {
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/RealKnoblauchbrot" },
      { platform: "Discord", url: "https://discord.com/channels/@me/285165039621505044" }
    ]
  },
  
  githubUsername: "RealKnoblauchbrot"
};

/**
 * Checks if a URL is a GitHub repository URL
 */
export function isGitHubUrl(url: string): boolean {
  return url?.includes('github.com') && !!extractRepoInfoFromUrl(url);
}

/**
 * Enhances project data with information fetched from GitHub
 */
export async function getEnhancedProjects(): Promise<Project[]> {
  const projects = [...siteConfig.projects.items];
  
  for (const project of projects) {
    if (project.link && isGitHubUrl(project.link)) {
      // Fetch repository details
      const repoDetails = await fetchRepoDetails(project.link);
      
      if (repoDetails) {
        project.fetchedTechnologies = repoDetails.languages;
        project.stars = repoDetails.stars;
        project.forks = repoDetails.forks;
        
        // Check if user is a contributor (not owner)
        if (siteConfig.githubUsername && !project.isContributor) {
          project.isContributor = await checkIsContributor(project.link, siteConfig.githubUsername);
        }
      }
    }
  }
  
  return projects;
}
