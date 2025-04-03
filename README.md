# mcp-server-gist

create gist by using MCP.

A Model Context Protocol(MCP) Server that wrap github [create gist](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist) api as a MCP tool.

## Tools

- `create-gist`
  - create a gist to your github account
  - Inputs:
    - gistContent(string): the content of the gist file.
    - isPublic(boolean): Whether the gist is public or secret, if not explicitly specified, it will be false.
    - filename(string): the name of the gist file, if not explicitly specified, it will be generated automatically.
  - Returns: gist url

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
        "GITHUB_GIST_TOKEN": "YOUR_OWN_GITHUB_TOKEN"
      }
    }
  }
}
```

[A fine grained TOKEN](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) is needed.
