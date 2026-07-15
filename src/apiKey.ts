import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js"

/**
 * The `extra` argument that the MCP SDK passes to every tool callback.
 * Carries the original HTTP request (and therefore its headers) for the
 * request currently being handled.
 */
export type ToolExtra = RequestHandlerExtra<ServerRequest, ServerNotification>

const invalidApiKeyResult: CallToolResult = {
  isError: true,
  content: [
    {
      type: "text",
      text: "Invalid API key",
    },
  ],
}

/**
 * Extracts the Brave Search API key from the `Authorization: Bearer <API_KEY>`
 * header of the current request. Returns `null` when the header is missing,
 * appears more than once, or does not match the expected `Bearer <token>`
 * format (including an empty token).
 */
const extractApiKey = (extra: ToolExtra): string | null => {
  const authorization = extra.requestInfo?.headers?.authorization

  if (!authorization || Array.isArray(authorization)) {
    return null
  }

  const match = /^Bearer (.+)$/.exec(authorization)
  const token = match?.[1]

  return token ? token : null
}

/**
 * Wraps a tool's `execute` function so that it receives the caller's Brave
 * Search API key (taken from the request's `Authorization` header) as its
 * second argument. The returned function has the shape the MCP SDK's
 * `registerTool` expects for its callback argument.
 *
 * If the `Authorization` header is absent or malformed, the wrapped
 * `execute` is never called and an `isError` tool result is returned instead.
 */
export const withApiKey = <Params>(
  execute: (params: Params, apiKey: string) => Promise<CallToolResult>
) => {
  return async (params: Params, extra: ToolExtra): Promise<CallToolResult> => {
    const apiKey = extractApiKey(extra)

    if (!apiKey) {
      return invalidApiKeyResult
    }

    return execute(params, apiKey)
  }
}
