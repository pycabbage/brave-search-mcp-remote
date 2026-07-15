import {
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test"
import { describe, expect, it } from "vitest"
import worker from "../src/index"

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>

const mcpInitializeRequest = () =>
  new IncomingRequest("http://example.com/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "vitest", version: "0.0.0" },
      },
    }),
  })

// The transport responds with a Server-Sent Events stream by default (rather
// than a single JSON body), so the JSON-RPC payload must be extracted from
// the `data:` line of the stream.
const readJsonRpcResultFromSseResponse = async (response: Response) => {
  const text = await response.text()
  const dataLine = text.split("\n").find((line) => line.startsWith("data:"))

  if (!dataLine) {
    throw new Error(`No SSE data line found in response body: ${text}`)
  }

  return JSON.parse(dataLine.slice("data:".length).trim()) as {
    result?: { serverInfo?: { name?: string } }
  }
}

describe("Brave Search MCP Remote worker", () => {
  it("returns 404 for unknown routes", async () => {
    const request = new IncomingRequest("http://example.com")
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext()
    const response = await worker.fetch(request, env, ctx)
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(404)
  })

  it("responds to an MCP initialize request on /mcp (unit style)", async () => {
    const ctx = createExecutionContext()
    const response = await worker.fetch(mcpInitializeRequest(), env, ctx)
    await waitOnExecutionContext(ctx)
    expect(response.status).toBe(200)

    const body = await readJsonRpcResultFromSseResponse(response)
    expect(body.result?.serverInfo?.name).toBe("brave-search-mcp-remote")
  })

  it("responds to an MCP initialize request on /mcp (integration style)", async () => {
    const response = await SELF.fetch(
      "https://example.com/mcp",
      mcpInitializeRequest()
    )
    expect(response.status).toBe(200)

    const body = await readJsonRpcResultFromSseResponse(response)
    expect(body.result?.serverInfo?.name).toBe("brave-search-mcp-remote")
  })
})
