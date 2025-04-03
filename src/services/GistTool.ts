import { Octokit } from "@octokit/core";

export class GistService {
    private octokit: Octokit;

    constructor(githubToken: string) {
        this.octokit = new Octokit({
            auth: githubToken
        });
    }

    /**
     * Creates a new gist on GitHub.
     *
     * @param content - The content of the gist.
     * @returns A Promise that resolves with the created gist's details or null if creation fails.
     */
    async createGist(content: string,
        isPublic: boolean,
        filename: string = "README.md") {
        try {
            const headers = {
                'X-GitHub-Api-Version': '2022-11-28',
                'accept': 'application/vnd.github+json'
            };

            const response = await this.octokit.request('POST /gists', {
                description: "gist from mcp-server-gist",
                'public': isPublic,
                files: {
                    [filename]: {
                        content: content,
                    }
                },
                headers: headers
            });

            if (response.status !== 201) {
                throw new Error(`Failed to create gist. Status code: ${response.status}`);
            }

            return {
                createdAt: response.data.created_at,
                htmlUrl: response.data.html_url
            };
        } catch (error) {
            console.error('Error creating gist:', error);
            return null;
        }
    }
}