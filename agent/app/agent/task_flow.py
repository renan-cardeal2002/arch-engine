import operator
from typing import TypedDict, Any, Annotated, Literal, List

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import StreamWriter
from langchain_core.messages import HumanMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_mcp_adapters.client import MultiServerMCPClient
from mcp import ClientSession, StdioServerParameters
from mcp.client.sse import sse_client
from mcp.client.stdio import stdio_client

# MCP servers to connect to
mcp_servers = {
    "booking": {
        "url": "http://localhost:3001/sse",
        "transport": "sse",
    },
    "calendar": {
        "url": "http://localhost:3002/sse",
        "transport": "sse",
    },
}

# Global variable to store MCP servers and their tools. Populated by initialize_mcp_tools()
mcp_servers_with_tools = {}
# Global variable to store tool name to server name mapping
tool_to_server_lookup = {}


async def initialize_mcp_tools():
    global mcp_servers_with_tools, tool_to_server_lookup
    try:
        async with MultiServerMCPClient(mcp_servers) as client:
            mcp_servers_with_tools = client.server_name_to_tools
            tool_to_server_lookup = {}
            for server_name, tools in mcp_servers_with_tools.items():
                for tool in tools:
                    tool_to_server_lookup[tool.name] = server_name
    except Exception as e:
        print(f"Error initializing MCP tools: {str(e)}")


async def call_mcp_tool(server_name: str, tool_name: str, args: dict[str, Any]) -> str:
    if server_name not in mcp_servers:
        raise ValueError(
            f"Server with name {server_name} not found in MCP servers list")

    protocol = mcp_servers[server_name]["transport"]

    tool_result = None
    if protocol == "sse":
        async with sse_client(mcp_servers[server_name]["url"]) as (reader, writer):
            async with ClientSession(reader, writer) as session:
                await session.initialize()
                tool_result = await session.call_tool(tool_name, args)
    elif protocol == "stdio":
        server_params = StdioServerParameters(
            command=mcp_servers[server_name]["command"],
            args=mcp_servers[server_name]["args"],
            env=None,
        )
        async with stdio_client(server_params) as (reader, writer):
            async with ClientSession(reader, writer) as session:
                await session.initialize()
                tool_result = await session.call_tool(tool_name, args)

    if not tool_result or tool_result.isError or not tool_result.content:
        return "Error calling tool"

    return tool_result.content[0].text


class Task(TypedDict):
    """Represents a single task in the flow."""

    description: str
    tool: str | None
    args: dict[str, Any]
    status: Literal["pending", "completed"]
    result: str | None


class TaskState(TypedDict):
    tasks: Annotated[List[Task], operator.add]
    current_task_index: int
    messages: list


def _assign_task(state: TaskState) -> Literal["execute", "__end__"]:
    if state["current_task_index"] >= len(state["tasks"]):
        return "__end__"
    return "execute"


@tool
async def execute_description(description: str) -> str:
    """Execute a task described in natural language."""
    llm = ChatOpenAI(model="gpt-4o-mini")
    msg = HumanMessage(content=f"Execute the following task: {description}")
    resp = await llm.ainvoke([msg])
    return resp.content or ""


def _select_tool(tool_name: str):
    if tool_name == "execute_description":
        return execute_description
    return None


async def execute_task(state: TaskState, writer: StreamWriter):
    try:
        task = state["tasks"][state["current_task_index"]]

        if task["tool"]:
            if task["tool"] in tool_to_server_lookup:
                server = tool_to_server_lookup[task["tool"]]
                result = await call_mcp_tool(server, task["tool"], task["args"])
            else:
                tool_fn = _select_tool(task["tool"])
                if tool_fn:
                    result = await call_tool(tool_fn, task["args"])
                else:
                    result = f"Tool {task['tool']} not found"
        else:
            result = await execute_description.ainvoke({"description": task["description"]})

        task["status"] = "completed"
        task["result"] = result
        writer({"tasks": [task]})

        state["messages"].append(ToolMessage(content=result, tool_call_id=str(state["current_task_index"])))

    except Exception as e:
        task = state["tasks"][state["current_task_index"]]
        task["status"] = "error"
        task["result"] = str(e)
        writer({"tasks": [task]})
        state["messages"].append(ToolMessage(content=str(e), tool_call_id=str(state["current_task_index"])))

    finally:
        state["current_task_index"] += 1
        return {"messages": state["messages"]}
    

async def call_tool(tool, args: dict):
    if hasattr(tool, "ainvoke"):
        return await tool.ainvoke(args)
    elif callable(tool):
        return await tool(**args)
    else:
        raise ValueError("Invalid tool")
    

async def init_task_flow(tasks: List[Task], use_mcp: bool = False):
    if use_mcp:
        await initialize_mcp_tools()
    builder = StateGraph(TaskState)
    builder.add_node("execute", execute_task)

    builder.add_edge(START, "execute")
    builder.add_conditional_edges("execute", _assign_task)
    builder.add_edge("execute", END)

    memory = MemorySaver()
    graph = builder.compile(checkpointer=None)
    graph.name = "TaskFlow"

    state = TaskState(tasks=tasks, current_task_index=0, messages=[])
    return graph, state
