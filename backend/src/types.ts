// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MessagePart {
	type: string;
	text: string;
}

export interface Message {
	role: "user" | "assistant" | "system" | "tool";
	parts: MessagePart[];
}

export interface PageContext {
	title: string;
	url: string;
	text: string;
	description: string;
	mainContent: string;
	timestamp: string;
}

export type MessageRow = {
	timestamp: string;
	role: string;
	content: string;
};

// ============================================================================
// STUDY MATERIAL TYPES
// ============================================================================

export interface StudyMaterialParams {
	pageContext: PageContext;
	userId: string;
	difficulty?: 'beginner' | 'intermediate' | 'advanced';
	materialTypes?: Array<'summary' | 'questions' | 'flashcards' | 'practice' | 'key_concepts'>;
}

export interface StudyMaterial {
	summary: string;
	keyConcepts: Array<{ concept: string; explanation: string; importance: string }>;
	studyQuestions: Array<{ question: string; answer: string; difficulty: string }>;
	flashcards: Array<{ front: string; back: string }>;
	practiceProblems: Array<{ problem: string; solution: string; hints: string[] }>;
	learningObjectives: string[];
	estimatedStudyTime: string;
	metadata: {
		generatedAt: string;
		pageTitle: string;
		pageUrl: string;
		difficulty: string;
	};
}

export interface ContentAnalysis {
	topics: string[];
	complexity: string;
	estimatedReadTime: string;
	contentType: string;
}

