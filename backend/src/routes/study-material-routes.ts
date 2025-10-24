import { PageContext } from "../types";
import { corsHeaders, WORKFLOW_STEP_DESCRIPTIONS } from "../config";

// ============================================================================
// STUDY MATERIAL WORKFLOW ROUTES
// ============================================================================

export async function handleStudyMaterialRoutes(
	req: Request,
	env: Env,
	action: string
): Promise<Response | null> {
	// Get workflow status with detailed progress information
	if (action.startsWith("status/")) {
		const instanceId = action.replace("status/", "");
		if (!instanceId) {
			return Response.json(
				{ error: "Instance ID required" },
				{ status: 400, headers: corsHeaders }
			);
		}

		try {
			const instance = await env.STUDY_MATERIAL_WORKFLOW.get(instanceId);
			const status = await instance.status();
			
			// Enhance status with user-friendly step descriptions
			const enhancedStatus = {
				...status,
				currentStepDescription: getCurrentStepDescription(status),
				progress: calculateProgress(status),
				estimatedTimeRemaining: estimateTimeRemaining(status)
			};

			return Response.json({ status: enhancedStatus }, { headers: corsHeaders });
		} catch (error) {
			return Response.json(
				{ error: "Workflow instance not found" },
				{ status: 404, headers: corsHeaders }
			);
		}
	}

	// Generate study materials
	if (action === "generate" && req.method === "POST") {
		try {
			const body = await req.json<{
				pageContext: PageContext;
				userId?: string;
				difficulty?: 'beginner' | 'intermediate' | 'advanced';
				materialTypes?: Array<'summary' | 'questions' | 'flashcards' | 'practice' | 'key_concepts'>;
			}>();

			if (!body.pageContext) {
				return Response.json(
					{ error: "Page context is required" },
					{ status: 400, headers: corsHeaders }
				);
			}

			// Create and start the workflow
			const instance = await env.STUDY_MATERIAL_WORKFLOW.create({
				params: {
					pageContext: body.pageContext,
					userId: body.userId || "default",
					difficulty: body.difficulty || "intermediate",
					materialTypes: body.materialTypes || ['summary', 'questions', 'flashcards', 'key_concepts']
				}
			});

			return Response.json(
				{
					success: true,
					instanceId: instance.id,
					message: "Study material generation started",
					statusUrl: `/study-materials/status/${instance.id}`
				},
				{ headers: corsHeaders }
			);
		} catch (error) {
			console.error("Error creating study material workflow:", error);
			return Response.json(
				{ error: "Failed to start study material generation" },
				{ status: 500, headers: corsHeaders }
			);
		}
	}

	// List all workflow instances (optional - for debugging)
	if (action === "list" && req.method === "GET") {
		return Response.json(
			{ message: "List endpoint - implement with D1/KV if needed" },
			{ headers: corsHeaders }
		);
	}

	return null;
}

// ============================================================================
// HELPER FUNCTIONS FOR PROGRESS TRACKING
// ============================================================================

function getCurrentStepDescription(status: any): string {
	// Get the current step being executed
	if (status.status === "running" && status.output?.steps) {
		const steps = Object.keys(WORKFLOW_STEP_DESCRIPTIONS);
		const completedSteps = status.output.steps?.length || 0;
		
		if (completedSteps < steps.length) {
			const currentStepName = steps[completedSteps];
			return WORKFLOW_STEP_DESCRIPTIONS[currentStepName] || "Processing...";
		}
	}
	
	if (status.status === "complete") {
		return "✓ Study materials generated successfully!";
	}
	
	if (status.status === "errored") {
		return "✗ An error occurred during generation";
	}
	
	return "Initializing...";
}

function calculateProgress(status: any): number {
	// Calculate percentage based on completed steps
	const totalSteps = Object.keys(WORKFLOW_STEP_DESCRIPTIONS).length;
	
	if (status.status === "complete") {
		return 100;
	}
	
	if (status.status === "running" && status.output?.steps) {
		const completedSteps = status.output.steps?.length || 0;
		return Math.round((completedSteps / totalSteps) * 100);
	}
	
	return 0;
}

function estimateTimeRemaining(status: any): string {
	const totalSteps = Object.keys(WORKFLOW_STEP_DESCRIPTIONS).length;
	
	if (status.status === "complete") {
		return "0 seconds";
	}
	
	if (status.status === "running" && status.output?.steps) {
		const completedSteps = status.output.steps?.length || 0;
		const remainingSteps = totalSteps - completedSteps;
		
		// Estimate ~10 seconds per step on average
		const estimatedSeconds = remainingSteps * 10;
		
		if (estimatedSeconds < 60) {
			return `~${estimatedSeconds} seconds`;
		} else {
			const minutes = Math.ceil(estimatedSeconds / 60);
			return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
		}
	}
	
	return "Calculating...";
}

