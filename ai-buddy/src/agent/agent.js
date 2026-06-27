import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import createTools from './tools.js'
import { ToolMessage, AIMessage } from '@langchain/core/messages'

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.5,
    apiKey: process.env.GEMINI_API_KEY
})


const graph = new StateGraph(MessagesAnnotation)
    .addNode("tools", async (state, config) => {

        const token = config.metadata.token

        // Create tools with token injected via closure
        const tools = createTools(token)

        const lastMessage = state.messages[state.messages.length - 1]
        const toolsCall = lastMessage.tool_calls

        const toolCallResults = await Promise.all(toolsCall.map(async (call) => {

            const tool = tools[call.name]
            if (!tool) {
                throw new Error(`Tool ${call.name} not found`)
            }


            // No need to pass token - it's already in the closure
            const toolResult = await tool.invoke(call.args)

            return new ToolMessage({
                content: toolResult,
                name: call.name,
                tool_call_id: call.id
            })

        }))

        return { messages: [...state.messages, ...toolCallResults] }

    })
    .addNode("chat", async (state, config) => {

        const token = config.metadata.token

        // Create tools with token to bind to model
        const tools = createTools(token)
        const toolsList = Object.values(tools)

        // Bind tools to model properly
        const modelWithTools = model.bindTools(toolsList)

        const response = await modelWithTools.invoke(state.messages)


        return {
            messages: [...state.messages, new AIMessage({
                content: response.content,
                tool_calls: response.tool_calls
            })]
        }

    })
    .addEdge("__start__", "chat")
    .addConditionalEdges("chat", async (state) => {

        const lastMessage = state.messages[state.messages.length - 1]

        if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
            return "tools"
        } else {
            return "__end__"
        }

    })
    .addEdge("tools", "chat")


const agent = graph.compile()

export default agent