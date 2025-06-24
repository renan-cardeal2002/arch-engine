import operator
from typing import TypedDict, Any, Annotated, Literal, List

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import StreamWriter
from langchain_core.messages import HumanMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool


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
            tool_fn = _select_tool(task["tool"])
            if tool_fn:
                result = await tool_fn.ainvoke(task["args"])
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
    

async def init_task_flow(tasks: List[Task]):
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
