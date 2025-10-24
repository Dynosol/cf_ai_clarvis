import { Message, PageContext } from "../types";
import { corsHeaders } from "../config";

// ============================================================================
// CHAT AGENT ROUTES
// ============================================================================

export async function handleChatRoutes(
	req: Request,
	env: Env,
	agentPath: string
): Promise<Response | null> {
	const [agentType, agentId, action] = agentPath.split("/");

	if (agentType !== "chat") {
		return null;
	}

	// Get or create a ChatAgent instance
	const id = env.ChatAgent.idFromName(agentId || "default");
	const stub = env.ChatAgent.get(id);

	if (action === "chat" && req.method === "POST") {
		const body = await req.json<{ 
			messages: Message[]; 
			pageContext?: PageContext;
		}>();
		const response = await stub.chat(body.messages, body.pageContext);

		return new Response(response, {
			headers: {
				...corsHeaders,
				"Content-Type": "text/event-stream",
			},
		});
	}

	if (action === "history" && req.method === "GET") {
		const history = await stub.getHistory();
		return Response.json({ history }, { headers: corsHeaders });
	}

	if (action === "clear" && req.method === "POST") {
		await stub.clearHistory();
		return Response.json(
			{ success: true },
			{ headers: corsHeaders },
		);
	}

	return Response.json(
		{ error: "Invalid chat agent action" },
		{ status: 404, headers: corsHeaders },
	);
}

