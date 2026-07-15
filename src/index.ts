import { StreamableHTTPTransport } from "@hono/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { Hono } from "hono"
import pkg from "../package.json"

const app = new Hono<{ Bindings: Env }>()

const mcpServer = new McpServer(
  {
    version: pkg.version,
    name: "brave-search-mcp-remote",
    title: "Brave Search MCP Remote",
  },
  {
    capabilities: {
      logging: {},
      tools: { listChanged: false },
    },
    instructions: `Use this server to search the Web for various types of data via the Brave Search API.`,
  }
)

// Register tools
//mcpServer.registerTool(...)
//mcpServer.registerTool(...)
//mcpServer.registerTool(...)

// sample procedure tool
mcpServer.registerTool(
  "sample_procedure",
  {
    title: "sample_procedure",
  },
  async ({ requestInfo }) => {
    const apiKey = requestInfo?.headers?.["x-api-key"]
    if (!apiKey || Array.isArray(apiKey)) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Invalid API key",
          },
        ],
      }
    }

    // some procedure logic here

    return {
      content: [
        // ...
      ],
    }
  }
)

const transport = new StreamableHTTPTransport()

app.all("/mcp", async (c) => {
  if (!mcpServer.isConnected()) {
    await mcpServer.connect(transport)
  }

  return transport.handleRequest(c)
})

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
