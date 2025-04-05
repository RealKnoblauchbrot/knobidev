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
  showInDropdown?: boolean; // Default to false
  id?: string; // URL-friendly ID for the project
}

// Helper function to generate URL-friendly IDs from project titles
export function getProjectId(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to check if a URL is a GitHub URL
export function isGitHubUrl(url: string): boolean {
  return url.includes('github.com') && !!extractRepoInfoFromUrl(url);
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
        link: "https://github.com/RealKnoblauchbrot/esx-vscode",
      },
      {
        title: "Item Gallery",
        description: "A Item Gallery mainly for GTA 5 Roleplay servers.",
        technologies: ["React", "Typescript"],
        showInDropdown: true,
        link: "/itemgallery"
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
 * Enhances project data with information fetched from GitHub
 */
export async function getEnhancedProjects(): Promise<Project[]> {
  const enhancedProjects = await Promise.all(
    siteConfig.projects.items.map(async (project) => {
      // Generate project ID for URL if not present
      if (!project.id) {
        project.id = getProjectId(project.title);
      }

      // Only fetch GitHub data if there's a GitHub link
      if (project.link && isGitHubUrl(project.link)) {
        try {
          const repoInfo = extractRepoInfoFromUrl(project.link);
          if (repoInfo) {
            const { owner, repo } = repoInfo;
            const repoDetails = await fetchRepoDetails(owner, repo);
            const isContributor = await checkIsContributor(
              owner, 
              repo, 
              siteConfig.githubUsername
            );
            
            return {
              ...project,
              stars: repoDetails?.stars,
              forks: repoDetails?.forks,
              fetchedTechnologies: repoDetails?.languages || [],
              isContributor
            };
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${project.title}:`, error);
        }
      }
      
      return project;
    })
  );

  return enhancedProjects;
}
