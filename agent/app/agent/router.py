from langgraph.types import Send

def assign_tool(state, mcp_servers_with_tools, tool_to_server_lookup):
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        send_list = []
        for tool in last_message.tool_calls:
            if tool["name"] == 'weather_tool':
                tool["args"]["context"] = state.get("context", {})
                send_list.append(Send('weather', tool))
            elif tool["name"] == 'create_reminder_tool':
                tool["args"]["context"] = state.get("context", {})
                send_list.append(Send('reminder', tool))
            elif any(tool["name"] == mcp_tool.name for mcp_tool in [tool for tools_list in mcp_servers_with_tools.values() for tool in tools_list]):
                server_name = tool_to_server_lookup.get(tool["name"], None)
                args = {
                    "server_name": server_name,
                    "name": tool["name"],
                    "args": {**tool["args"], "context": state.get("context", {})},
                    "id": tool["id"]
                }
                send_list.append(Send('mcp_tool', args))
        return send_list if len(send_list) > 0 else "__end__"
    return "__end__"
