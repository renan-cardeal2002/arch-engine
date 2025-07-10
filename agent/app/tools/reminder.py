from app.types.agent_types import Context, ToolNodeArgs
from langchain_core.tools import tool
from langchain_core.messages import ToolMessage
from langgraph.types import interrupt

@tool
async def create_reminder_tool(reminder_text: str, context: Context) -> str:
    """Call to create a reminder"""
    
    print(f"Esse é o contexto: {context}")
    return "Reminder created"


async def reminder(input: ToolNodeArgs):
    context = input['args'].get('context', {})
    res = interrupt(input['args']['reminder_text'])

    tool_answer = "Reminder created." if res == 'approve' else "Reminder creation cancelled by user."

    return {"messages": [ToolMessage(content=tool_answer, tool_call_id=input["id"])]}

