import { Agent } from "agents";
import { Message, PageContext, MessageRow } from "../types";
import { getAgentConfig } from "../config";

// ============================================================================
// CHAT AGENT
// ============================================================================

export class ChatAgent extends Agent {
	async chat(messages: Message[], pageContext?: PageContext) {
		// Get the last user message
		const lastMessage = messages[messages.length - 1];
		const userContent = lastMessage.parts
			.filter((p) => p.type === "text")
			.map((p) => p.text)
			.join("\n");

		// Get agent configuration
		const config = getAgentConfig("chat");
		if (!config) {
			throw new Error("Chat agent configuration not found");
		}

		try {
			// Build system prompt with page context if available
			let systemPrompt = config.systemPrompt;
			
			if (pageContext) {
				systemPrompt += `\n\n=== CURRENT WEB PAGE CONTEXT ===
Title: ${pageContext.title}
URL: ${pageContext.url}
Description: ${pageContext.description || 'N/A'}

Page Content:
${pageContext.mainContent || pageContext.text}

=== END CONTEXT ===

The user is currently viewing this web page. Use this context to answer their questions accurately. When they ask about "this page" or "what's on the page", refer to the content above.`;
			}

			// Check if AI binding is available (for local development)
			if (!this.env.AI) {
				console.warn("AI binding not available, using mock response for local development");
				// Return a mock streaming response for local development
				const mockResponse = `Hello! I'm Clarvis, your AI assistant. I can see you said: "${userContent}". 

In a production environment, I would use Cloudflare's AI models to provide intelligent responses. For local development, this is a mock response.

${pageContext ? `I can see you're viewing: ${pageContext.title} (${pageContext.url})` : ''}

To test the full AI functionality, please deploy this worker to Cloudflare using \`wrangler deploy\`.`;

				// Create a mock streaming response
				const encoder = new TextEncoder();
				const stream = new ReadableStream({
					start(controller) {
						// Simulate streaming by sending chunks
						const chunks = mockResponse.split(' ');
						let index = 0;
						
						const sendChunk = () => {
							if (index < chunks.length) {
								const chunk = chunks[index] + (index < chunks.length - 1 ? ' ' : '');
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: chunk })}\n\n`));
								index++;
								setTimeout(sendChunk, 50); // Simulate streaming delay
							} else {
								controller.enqueue(encoder.encode('data: [DONE]\n\n'));
								controller.close();
							}
						};
						
						sendChunk();
					}
				});

				// Store the conversation in state along with page context
				await this.setState({
					lastMessage: userContent,
					pageContext: pageContext,
					timestamp: new Date().toISOString(),
				});

				return stream;
			}

			// Use Workers AI to generate response with configuration parameters
			const response = await this.env.AI.run(config.model as any, {
				messages: [
					{
						role: "system",
						content: systemPrompt,
					},
					...messages.map((m) => ({
						role: m.role,
						content: m.parts
							.filter((p) => p.type === "text")
							.map((p) => p.text)
							.join("\n"),
					})),
				],
				stream: true,
				...config.parameters,
			});

			// Store the conversation in state along with page context
			await this.setState({
				lastMessage: userContent,
				pageContext: pageContext,
				timestamp: new Date().toISOString(),
			});

			return response;
		} catch (error) {
			console.error("Error calling Workers AI:", error);
			
			// Handle specific error cases
			let errorMessage = "Unknown error occurred";
			let helpfulMessage = "";
			
			if (error instanceof Error) {
				errorMessage = error.message;
				
				// Handle specific error codes
				if (error.message.includes("error code: 1031")) {
					helpfulMessage = `AI model error (1031): The model '@cf/meta/llama-3.1-8b-instruct' may not be available in your region or account. 
					
Try these solutions:
1. Check if Workers AI is enabled in your Cloudflare account
2. Verify you have the correct permissions for AI models
3. Try deploying to production: \`wrangler deploy\`
4. Check the Cloudflare dashboard for AI model availability`;
				} else if (error.message.includes("Network connection lost")) {
					helpfulMessage = `Network connection issue. This typically happens in local development mode.

To get full AI functionality:
1. Deploy this worker to Cloudflare: \`wrangler deploy\`
2. Or check your Cloudflare account setup`;
				} else if (error.message.includes("model")) {
					helpfulMessage = `Model configuration error. The AI model may not be available or properly configured.

Check:
1. Model name is correct in config.ts
2. Workers AI is enabled in your account
3. You have proper permissions for AI inference`;
				}
			}
			
			// If we have a helpful message, return it as a mock response
			if (helpfulMessage) {
				const mockResponse = `⚠️ **AI Service Error**

${helpfulMessage}

**Original Error:** ${errorMessage}

**Your Question:** "${userContent}"

I'm unable to process your request right now due to this technical issue. Please try the suggested solutions above.`;

				const encoder = new TextEncoder();
				const stream = new ReadableStream({
					start(controller) {
						controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: mockResponse })}\n\n`));
						controller.enqueue(encoder.encode('data: [DONE]\n\n'));
						controller.close();
					}
				});

				return stream;
			}
			
			throw new Error(`Failed to generate AI response: ${errorMessage}`);
		}
	}

	async getHistory() {
		// Retrieve conversation history from SQL storage
		const messages = await this.sql<MessageRow>`SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50`;
		return messages;
	}

	async clearHistory() {
		await this.sql`DELETE FROM messages`;
		await this.setState({ cleared: true, timestamp: new Date().toISOString() });
	}
}

