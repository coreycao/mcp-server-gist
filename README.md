# mcp-server-gist

A simple Model Context Protocol(MCP) Server than wrap github [create gist](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist) api as a MCP tool.

## Usage

```json
{
  "mcpServers": {
    "create-gist": {
      "command": "node",
      "args": [
        "LOCAL_ABSOLUTE_PATH/mcp-server-gist/build/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": YOUR_GITHUB_TOKEN
      }
    }
  }
}
```

[A fine grained TOKEN](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) is needed.
