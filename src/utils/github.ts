export interface RepoInfo {
  owner: string;
  repo: string;
}

export interface RepoDetails {
  stars?: number;
  forks?: number;
  languages?: string[];
}

/**
 * Extracts owner and repository name from a GitHub URL
 */
export function extractRepoInfoFromUrl(url: string): { owner: string; repo: string } | null {
  // Handle GitHub URLs in the format: https://github.com/owner/repo
  try {
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(githubRegex);
    
    if (match && match.length === 3) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
  } catch (error) {
    console.error("Error extracting repo info:", error);
  }
  
  return null;
}

/**
 * Fetches detailed information about a GitHub repository
 */
export async function fetchRepoDetails(owner: string, repo: string): Promise<RepoDetails | null> {
  try {
    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }
    
    const repoData = await repoResponse.json();
    
    // Fetch repository languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
    if (!languagesResponse.ok) {
      throw new Error(`GitHub API error: ${languagesResponse.status}`);
    }
    
    const languagesData = await languagesResponse.json();
    const languages = Object.keys(languagesData);
    
    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      languages: languages
    };
  } catch (error) {
    console.error(`Failed to fetch repo details for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Checks if a user is a contributor to a repository
 */
export async function checkIsContributor(owner: string, repo: string, username: string): Promise<boolean> {
  try {
    // Check if the user is a contributor to the repository
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const contributors = await response.json();
    return contributors.some((contributor: any) => contributor.login === username);
  } catch (error) {
    console.error(`Failed to check contributor status for ${username} in ${owner}/${repo}:`, error);
    return false;
  }
}
