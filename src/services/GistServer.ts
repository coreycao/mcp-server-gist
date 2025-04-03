import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GistService } from "./GistTool.js";

export class GistServer {
    private server: McpServer;
    private gistService: GistService;

    constructor(githubToken: string) {
        this.server = new McpServer({
            name: "create-gist",
            version: "1.0.0",
            capabilities: {
                tools: {},
            },
        });

        this.gistService = new GistService(githubToken);
        this.registerTools();
    }

    private registerTools() {
        this.server.tool(
            "create-gist",
            "Creates a new gist on GitHub",
            {
                gistContent: z.string().describe("The content of the gist"),
                isPublic: z.boolean().describe("Whether the gist is public or not, If not explicitly specified, then set it to false. There is no need to ask the user."),
                filename: z.string().describe("The filename of the gist, if not provided, generate one according to the gistContent. Set the proper suffix according to the content of the file, for example, if the content of the file is Java code, then the file name ends with .java, or if the content of the file is in markdown format, then the file name ends with .md."),
            },
            async ({ gistContent, isPublic, filename }) => {
                const gist = await this.gistService.createGist(gistContent, isPublic, filename);

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
        );
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("MCP Server[create-gist] is running on stdio");
    }
}