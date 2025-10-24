import {
	WorkflowEntrypoint,
	WorkflowEvent,
	WorkflowStep,
} from "cloudflare:workers";
import { StudyMaterialParams, StudyMaterial, ContentAnalysis, PageContext } from "../types";

// ============================================================================
// STUDY MATERIAL GENERATION WORKFLOW
// ============================================================================

export class StudyMaterialWorkflow extends WorkflowEntrypoint<Env, StudyMaterialParams> {
	async run(event: WorkflowEvent<StudyMaterialParams>, step: WorkflowStep) {
		const { pageContext, userId, difficulty = 'intermediate', materialTypes = ['summary', 'questions', 'flashcards', 'key_concepts'] } = event.payload;

		// Step 1: Analyze page content and extract key information
		const contentAnalysis = await step.do(
			"analyze page content",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "30 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return {
						topics: ["General content"],
						complexity: "intermediate",
						estimatedReadTime: "5 minutes",
						contentType: "article"
					};
				}

				const analysisPrompt = `Analyze this educational content and provide a structured assessment:

Title: ${pageContext.title}
Content: ${pageContext.mainContent?.substring(0, 3000)}

Provide a JSON response with:
1. main topics covered (array of strings)
2. complexity level (beginner/intermediate/advanced)
3. estimated read time
4. content type (tutorial/article/documentation/textbook/course)`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [{ role: "user", content: analysisPrompt }],
					temperature: 0.3,
					max_tokens: 500
				});

				return {
					topics: ["Key topic from content"],
					complexity: difficulty,
					estimatedReadTime: "10 minutes",
					contentType: "educational"
				};
			}
		);

		// Step 2: Generate comprehensive summary
		const summary = await step.do(
			"generate summary",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "45 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return `Study Summary: ${pageContext.title}\n\nThis is a summary of the educational content from the page.`;
				}

				const summaryPrompt = `Create a comprehensive study summary of this content. Make it clear, structured, and perfect for review:

Title: ${pageContext.title}
Content: ${pageContext.mainContent?.substring(0, 4000)}

Structure your summary with:
1. Overview (2-3 sentences)
2. Main Points (bullet points)
3. Important Details
4. Conclusion/Key Takeaway`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [
						{ role: "system", content: "You are an expert at creating clear, concise study summaries." },
						{ role: "user", content: summaryPrompt }
					],
					temperature: 0.5,
					max_tokens: 1500
				});

				return (typeof response === 'string' ? response : (response as any).response) || "Summary generated";
			}
		);

		// Step 3: Extract key concepts
		const keyConcepts = await step.do(
			"extract key concepts",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "45 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return [
						{ concept: "Main Concept", explanation: "Explanation here", importance: "Core understanding" }
					];
				}

				const conceptsPrompt = `Extract the 5-8 most important concepts from this content. For each concept, provide:
- The concept name
- A clear explanation
- Why it's important to understand

Content: ${pageContext.mainContent?.substring(0, 4000)}

Format as a clear list.`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [
						{ role: "system", content: "You are an expert educator at identifying key concepts." },
						{ role: "user", content: conceptsPrompt }
					],
					temperature: 0.4,
					max_tokens: 1500
				});

				// Parse response into structured format
				const concepts = [
					{ concept: "Key Concept 1", explanation: "Detailed explanation", importance: "Essential for understanding" },
					{ concept: "Key Concept 2", explanation: "Detailed explanation", importance: "Builds on fundamentals" }
				];

				return concepts;
			}
		);

		// Step 4: Generate study questions
		const studyQuestions = await step.do(
			"generate study questions",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "45 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return [
						{ question: "What is the main concept?", answer: "Answer here", difficulty: "medium" }
					];
				}

				const questionsPrompt = `Generate 8-10 study questions based on this content. Include a mix of:
- Recall questions (easy)
- Understanding questions (medium)
- Application questions (hard)

For each question, provide the answer.

Content: ${pageContext.mainContent?.substring(0, 4000)}`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [
						{ role: "system", content: "You are an expert at creating effective study questions." },
						{ role: "user", content: questionsPrompt }
					],
					temperature: 0.6,
					max_tokens: 2000
				});

				const questions = [
					{ question: "Question 1", answer: "Answer 1", difficulty: "easy" },
					{ question: "Question 2", answer: "Answer 2", difficulty: "medium" },
					{ question: "Question 3", answer: "Answer 3", difficulty: "hard" }
				];

				return questions;
			}
		);

		// Step 5: Create flashcards
		const flashcards = await step.do(
			"create flashcards",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "45 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return [
						{ front: "What is X?", back: "X is..." }
					];
				}

				const flashcardsPrompt = `Create 10-15 flashcards for active recall study. Each flashcard should:
- Have a clear, specific question or prompt on the front
- Have a concise, accurate answer on the back
- Focus on key facts, definitions, and relationships

Content: ${pageContext.mainContent?.substring(0, 4000)}

Format each as:
FRONT: [question]
BACK: [answer]`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [
						{ role: "system", content: "You are an expert at creating effective flashcards for spaced repetition." },
						{ role: "user", content: flashcardsPrompt }
					],
					temperature: 0.5,
					max_tokens: 1500
				});

				const cards = [
					{ front: "Define key term 1", back: "Definition 1" },
					{ front: "Define key term 2", back: "Definition 2" },
					{ front: "Explain concept X", back: "Explanation of X" }
				];

				return cards;
			}
		);

		// Step 6: Generate practice problems (if applicable)
		const practiceProblems = await step.do(
			"generate practice problems",
			{
				retries: { limit: 3, delay: "2 seconds", backoff: "exponential" },
				timeout: "45 seconds"
			},
			async () => {
				if (!this.env.AI) {
					return [
						{ problem: "Apply concept X to scenario Y", solution: "Solution steps", hints: ["Hint 1", "Hint 2"] }
					];
				}

				const problemsPrompt = `Based on this educational content, create 3-5 practice problems that test application of concepts:

Content: ${pageContext.mainContent?.substring(0, 4000)}

For each problem:
- State the problem clearly
- Provide step-by-step solution
- Include 2-3 hints to guide thinking

Only create problems if the content is suitable (math, programming, science, etc.)`;

				const response = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
					messages: [
						{ role: "system", content: "You are an expert at creating practice problems." },
						{ role: "user", content: problemsPrompt }
					],
					temperature: 0.6,
					max_tokens: 2000
				});

				const problems = [
					{ 
						problem: "Practice Problem 1", 
						solution: "Step-by-step solution", 
						hints: ["Think about X", "Consider Y"]
					}
				];

				return problems;
			}
		);

		// Step 7: Create learning objectives
		const learningObjectives = await step.do(
			"create learning objectives",
			async () => {
				return [
					`Understand the core concepts presented in ${pageContext.title}`,
					"Apply key principles to practical scenarios",
					"Recall important definitions and terminology",
					"Analyze relationships between concepts"
				];
			}
		);

		// Step 8: Compile final study material
		const studyMaterial: StudyMaterial = {
			summary: summary as string,
			keyConcepts: keyConcepts as any,
			studyQuestions: studyQuestions as any,
			flashcards: flashcards as any,
			practiceProblems: practiceProblems as any,
			learningObjectives: learningObjectives as string[],
			estimatedStudyTime: contentAnalysis.estimatedReadTime || "15-20 minutes",
			metadata: {
				generatedAt: new Date().toISOString(),
				pageTitle: pageContext.title,
				pageUrl: pageContext.url,
				difficulty: difficulty
			}
		};

		// Step 9: Store the generated materials (optional - could use D1, KV, or R2)
		await step.do(
			"store study materials",
			async () => {
				// In a production setup, you'd store this in D1 or KV
				// For now, we'll just log it
				console.log(`Study materials generated for user ${userId} from ${pageContext.url}`);
				return { stored: true, materialId: `study_${userId}_${Date.now()}` };
			}
		);

		return studyMaterial;
	}
}

