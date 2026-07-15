import { StreamableHTTPTransport } from "@hono/mcp"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { Hono } from "hono"
import pkg from "../package.json"

const app = new Hono()

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
