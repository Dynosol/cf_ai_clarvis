// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

import { corsHeaders } from "./config";
import { handleChatRoutes } from "./routes/chat-routes";
import { handleStudyMaterialRoutes } from "./routes/study-material-routes";

// Export agents and workflows
export { ChatAgent } from "./agents/chat-agent";
export { StudyMaterialWorkflow } from "./workflows/study-material-workflow";

// Export types for external use
export type { Message, PageContext, StudyMaterial } from "./types";

// ============================================================================
// MAIN FETCH HANDLER
// ============================================================================

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);

		// Handle CORS preflight
		if (req.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		// Favicon handling
		if (url.pathname.startsWith("/favicon")) {
			return Response.json({}, { status: 404 });
		}

		// Chat agent routes
		if (url.pathname.startsWith("/agent/")) {
			const agentPath = url.pathname.replace("/agent/", "");
			const response = await handleChatRoutes(req, env, agentPath);
			
			if (response) {
				return response;
			}

			return Response.json(
				{ error: "Invalid agent endpoint" },
				{ status: 404, headers: corsHeaders },
			);
		}

		// Study Material Workflow routes
		if (url.pathname.startsWith("/study-materials")) {
			const action = url.pathname.replace("/study-materials", "").replace(/^\//, "");
			const response = await handleStudyMaterialRoutes(req, env, action);
			
			if (response) {
				return response;
			}

			return Response.json(
				{ error: "Invalid study materials endpoint" },
				{ status: 404, headers: corsHeaders },
			);
		}

		// Health check
		if (url.pathname === "/health") {
			return Response.json(
				{ status: "healthy", timestamp: new Date().toISOString() },
				{ headers: corsHeaders },
			);
		}

		// API documentation (root)
		return Response.json(
			{
				message: "Clarvis Backend API",
				version: "1.0.0",
				endpoints: {
					health: {
						path: "/health",
						method: "GET",
						description: "Health check endpoint"
					},
					chat: {
						chat: {
							path: "/agent/chat/{agentId}/chat",
							method: "POST",
							description: "Send a message to the chat agent"
						},
						history: {
							path: "/agent/chat/{agentId}/history",
							method: "GET",
							description: "Get chat history"
						},
						clear: {
							path: "/agent/chat/{agentId}/clear",
							method: "POST",
							description: "Clear chat history"
						}
					},
					studyMaterials: {
						generate: {
							path: "/study-materials/generate",
							method: "POST",
							description: "Generate study materials from page content"
						},
						status: {
							path: "/study-materials/status/{instanceId}",
							method: "GET",
							description: "Get workflow status and progress"
						},
						list: {
							path: "/study-materials/list",
							method: "GET",
							description: "List all workflow instances"
						}
					}
				},
			},
			{ headers: corsHeaders },
		);
	},
};
