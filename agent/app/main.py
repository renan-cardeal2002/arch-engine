import asyncio
from dotenv import load_dotenv

load_dotenv()

from app.config.mcp_servers import mcp_servers
from app.config.prompt import SYSTEM_PROMPT
from app.types.agent_types import State, Context, WeatherInput, ToolNodeArgs, McpToolNodeArgs
from app.tools.weather import weather_tool, weather
from app.tools.reminder import create_reminder_tool, reminder
from app.tools.mcp_tools import make_mcp_tool_node
from app.services.mcp_initializer import initialize_mcp_tools
from app.agent.router import assign_tool
from app.agent.graph_builder import build_graph

mcp_servers_with_tools = {}
tool_to_server_lookup = {}

async def chatbot(state: State):
    tools = [
        weather_tool,
        create_reminder_tool,
    ] + [tool for tools_list in mcp_servers_with_tools.values() for tool in tools_list]

    from langchain_openai import ChatOpenAI
    from langchain_core.messages import SystemMessage

    llm = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)
    messages = list(state["messages"])
    system_prompt = state.get("system_prompt") or SYSTEM_PROMPT
    if system_prompt:
        messages = [SystemMessage(content=system_prompt)] + messages
    response = await llm.ainvoke(messages)
    return {"messages": [response]}

async def init_agent(use_mcp: bool):
    global mcp_servers_with_tools, tool_to_server_lookup
    if use_mcp:
        mcp_servers_with_tools, tool_to_server_lookup = await initialize_mcp_tools(mcp_servers)
    else:
        mcp_servers_with_tools, tool_to_server_lookup = {}, {}
        
    mcp_tool_node = make_mcp_tool_node(mcp_servers)
    
    return build_graph(
        State,
        chatbot,
        weather,
        reminder,
        mcp_tool_node,
        lambda state: assign_tool(state, mcp_servers_with_tools, tool_to_server_lookup)
    )

# Para executar: asyncio.run(init_agent(True))
