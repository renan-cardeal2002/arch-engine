from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

def build_graph(State, chatbot, weather, reminder, mcp_tool, assign_tool):
    builder = StateGraph(State)
    builder.add_node("chatbot", chatbot)
    builder.add_node("weather", weather)
    builder.add_node("reminder", reminder)
    builder.add_node("mcp_tool", mcp_tool)

    builder.add_edge(START, "chatbot")
    builder.add_conditional_edges("chatbot", assign_tool)
    builder.add_edge("weather", "chatbot")
    builder.add_edge("reminder", "chatbot")
    builder.add_edge("mcp_tool", "chatbot")

    builder.add_edge("chatbot", END)

    memory = MemorySaver()
    graph = builder.compile(checkpointer=memory)
    graph.name = "LangGraph Agent"
    return graph
