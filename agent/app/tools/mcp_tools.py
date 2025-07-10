from app.types.agent_types import McpToolNodeArgs
from mcp.client.sse import sse_client
from mcp.client.stdio import stdio_client
from mcp import ClientSession, StdioServerParameters
from langchain_core.messages import ToolMessage


def make_mcp_tool_node(mcp_servers):
    async def mcp_tool(input: McpToolNodeArgs):
        context = input["args"].get("context", {})
        if input["server_name"] not in mcp_servers:
            raise ValueError(
                f"Server with name {input['server_name']} not found in MCP servers list")

        protocol = mcp_servers[input["server_name"]]["transport"]

        tool_result = None
        if protocol == "sse":
            async with sse_client(mcp_servers[input["server_name"]]["url"]) as (reader, writer):
                async with ClientSession(reader, writer) as session:
                    await session.initialize()
                    tool_result = await session.call_tool(input["name"], input["args"])
        elif protocol == "stdio":
            server_params = StdioServerParameters(
                command=mcp_servers[input["server_name"]]["command"],
                args=mcp_servers[input["server_name"]]["args"],
                env=None,  # Optional environment variables
            )
            async with stdio_client(server_params) as (reader, writer):
                async with ClientSession(reader, writer) as session:
                    await session.initialize()
                    tool_result = await session.call_tool(input["name"], input["args"])

        if not tool_result or tool_result.isError or not tool_result.content:
            return {"messages": [ToolMessage(content="Error calling tool", tool_call_id=input["id"])]}

        return {"messages": [ToolMessage(content=tool_result.content[0].text, tool_call_id=input["id"])]}
    return mcp_tool
