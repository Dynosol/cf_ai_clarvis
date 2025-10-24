// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Agent configurations
export interface AgentConfig {
	model: string;
	systemPrompt: string;
	parameters: {
		temperature?: number;
		max_tokens?: number;
		top_p?: number;
	};
}

const agentConfigs: Record<string, AgentConfig> = {
	chat: {
		model: '@cf/meta/llama-3.1-8b-instruct',
		systemPrompt: `You are Clarvis, an intelligent AI assistant integrated into a Chrome extension. You help users understand and interact with web content.

Your capabilities:
- Answer questions about web pages the user is viewing
- Provide explanations and summaries
- Help with research and learning
- Assist with general knowledge questions

Be helpful, accurate, and concise. When discussing web page content, reference specific details from the provided context.`,
		parameters: {
			temperature: 0.7,
			max_tokens: 2048,
		}
	}
};

export function getAgentConfig(agentType: string): AgentConfig | undefined {
	return agentConfigs[agentType];
}

// Workflow step descriptions for user-friendly progress updates
export const WORKFLOW_STEP_DESCRIPTIONS: Record<string, string> = {
	"analyze page content": "Analyzing page content and identifying key topics...",
	"generate summary": "Creating comprehensive summary...",
	"extract key concepts": "Extracting and explaining key concepts...",
	"generate study questions": "Generating practice questions...",
	"create flashcards": "Creating flashcards for active recall...",
	"generate practice problems": "Developing practice problems...",
	"create learning objectives": "Defining learning objectives...",
	"store study materials": "Finalizing and saving study materials..."
};

