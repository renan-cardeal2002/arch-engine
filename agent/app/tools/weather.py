from app.types.agent_types import Context, WeatherInput
from langchain_core.tools import tool
import random
import asyncio
from langchain_core.messages import ToolMessage
from langgraph.types import StreamWriter

@tool
async def weather_tool(query: str, context: Context) -> str:
    """Call to get current weather"""
    return "Sunny"


async def weather(input: WeatherInput, writer: StreamWriter):
    location = input["args"]["query"]
    context = input["args"].get("context", {})

    # Send custom event to the client. It will update the state of the last checkpoint and all child nodes.
    # Note: if there are multiple child nodes (e.g. parallel nodes), the state will be updated for all of them.
    writer({"weather_forecast": [
           {"location": location, "search_status": f"Checking weather in {location}"}]})

    await asyncio.sleep(2)
    weather = random.choice(["Sunny", "Cloudy", "Rainy", "Snowy"])

    return {"messages": [ToolMessage(content=weather, tool_call_id=input["id"])], "weather_forecast": [{"location": location, "search_status": "", "result": weather}]}

