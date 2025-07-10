from langchain_mcp_adapters.client import MultiServerMCPClient

async def initialize_mcp_tools(mcp_servers):
    mcp_servers_with_tools = {}
    tool_to_server_lookup = {}
    try:
        async with MultiServerMCPClient(mcp_servers) as client:
            mcp_servers_with_tools = client.server_name_to_tools
            for server_name, tools in mcp_servers_with_tools.items():
                for tool in tools:
                    tool_to_server_lookup[tool.name] = server_name
    except Exception as e:
        print(f"Error initializing MCP tools: {str(e)}")
    return mcp_servers_with_tools, tool_to_server_lookup