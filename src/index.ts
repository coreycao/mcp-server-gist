import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Octokit } from "@octokit/core";
import * as dotenv from 'dotenv';

dotenv.config();

const server = new McpServer({
    name: "create-gist",
    version: "1.0.0",
    capabilities: {
        tools: {},
    },
});

const githubToken = process.env.GITHUB_TOKEN;

// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
    auth: githubToken
})

/**
 * Makes a POST request to the /gists endpoint to create a new gist.
 *
 * @param description - Description of the gist.
 * @param files - Names and content for the files that make up the gist.
 *
 * @returns A Promise that resolves when the gist is created.
 */
async function createGist(content: string) {
    try {
        const headers = {
            'X-GitHub-Api-Version': '2022-11-28',
            'accept': 'application/vnd.github+json'
        };

        const response = await octokit.request('POST /gists', {
            description: "gist created by mcp server",
            'public': false,
            files: {
                'README.md': {
                    content: content,
                }
            },
            headers: headers
        });

        // 检查状态码
        if (response.status !== 201) {
            throw new Error(`Failed to create gist. Status code: ${response.status}`);
        }

        // 返回所需字段
        return {
            createdAt: response.data.created_at,
            htmlUrl: response.data.html_url
        };
    } catch (error) {
        console.error('Error creating gist:', error);
        throw null;
    }
}

interface GistParams {
    description: string;
    isPublic: boolean;
    files: Record<string, { content: string }>;
}

// register tool
server.tool(
    "create-gist",
    "Creates a new gist on GitHub", {
    gistContent: z.string().describe("The content of the gist"),
},
    async ({ gistContent }) => {
        const gist = await createGist(gistContent);

        if (!gist) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to create gist."
                    },
                ],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Gist created successfully. Created at: ${gist.createdAt}, HTML URL: ${gist.htmlUrl}`
                },
            ],
        };
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Server[create-gist] is running on stdio");
}

main().catch(
    (err) => {
        console.error("MCP Server[create-gist] fatal error in main():", err);
        process.exit(1);
    }
)