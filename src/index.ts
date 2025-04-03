#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { GistServer } from "./services/GistServer.js";

dotenv.config();

const githubToken = process.env.GITHUB_GIST_TOKEN;
// check if github token is provided
if (!githubToken) {
    throw new Error('GitHub token is required but not provided');
}

const gistServer = new GistServer(githubToken);

async function main() {
    await gistServer.start();
}

main().catch(
    (err) => {
        console.error("MCP Server[create-gist] fatal error in main():", err);
        process.exit(1);
    }
)