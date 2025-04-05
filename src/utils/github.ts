export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface RepoDetails {
  languages: string[];
  stars: number;
  forks: number;
  isContributor?: boolean;
}

/**
 * Extracts owner and repository name from a GitHub URL
 */
export function extractRepoInfoFromUrl(url: string): RepoInfo | null {
  if (!url) return null;
  
  // Match GitHub URLs in the format https://github.com/owner/repo
  const match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2]
  };
}

/**
 * Fetches programming languages used in a GitHub repository
 */
export async function fetchGitHubLanguages(url: string): Promise<string[]> {
  const repoInfo = extractRepoInfoFromUrl(url);
  if (!repoInfo) return [];
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/languages`
    );
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const languages = await response.json();
    return Object.keys(languages);
  } catch (error) {
    console.error("Failed to fetch GitHub languages:", error);
    return [];
  }
}

/**
 * Fetches detailed information about a GitHub repository
 */
export async function fetchRepoDetails(url: string): Promise<RepoDetails | null> {
  const repoInfo = extractRepoInfoFromUrl(url);
  if (!repoInfo) return null;
  
  try {
    const repoResponse = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`
    );
    
    if (!repoResponse.ok) {
      console.error(`GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`);
      return null;
    }
    
    const repoData = await repoResponse.json();
    
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/languages`
    );
    
    let languages: string[] = [];
    if (languagesResponse.ok) {
      const languagesData = await languagesResponse.json();
      languages = Object.keys(languagesData);
    }
    
    return {
      languages,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      isContributor: false 
    };
  } catch (error) {
    console.error("Failed to fetch repo details:", error);
    return null;
  }
}

/**
 * Checks if a user is a contributor to a repository
 */
export async function checkIsContributor(url: string, username: string): Promise<boolean> {
  const repoInfo = extractRepoInfoFromUrl(url);
  if (!repoInfo || !username) return false;
  
  try {
    if (repoInfo.owner.toLowerCase() === username.toLowerCase()) {
      return false; // Not a contributor but the owner
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contributors`
    );
    
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const contributors = await response.json();
    return contributors.some((contributor: any) => 
      contributor.login.toLowerCase() === username.toLowerCase()
    );
  } catch (error) {
    console.error("Failed to check contributor status:", error);
    return false;
  }
}
