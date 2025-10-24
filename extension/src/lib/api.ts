export interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  parts: Array<{
    type: "text";
    text: string;
  }>;
  timestamp?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function getBackendUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["agentUrl"], (result) => {
      resolve(result.agentUrl || "http://localhost:8787");
    });
  });
}

export async function setBackendUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ agentUrl: url }, () => {
      resolve();
    });
  });
}

export interface PageContext {
  title: string;
  url: string;
  text: string;
  description: string;
  mainContent: string;
  timestamp: string;
}

export async function sendChatMessage(
  messages: Message[],
  agentId: string = "default",
  onChunk?: (text: string) => void,
  pageContext?: PageContext,
  signal?: AbortSignal
): Promise<string> {
  const backendUrl = await getBackendUrl();
  const endpoint = `${backendUrl}/agent/chat/${agentId}/chat`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      messages,
      pageContext 
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/event-stream")) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (signal?.aborted) {
        reader.cancel();
        throw new Error("Stream interrupted");
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.response) {
              fullText += parsed.response;
              
              if (onChunk) {
                onChunk(fullText);
              }
            }
          } catch (e) {
            console.warn('Failed to parse SSE data:', data, e);
          }
        }
      }
    }

    return fullText;
  } else {
    const data = await response.json();
    return data.message || data.response || "";
  }
}

export async function getChatHistory(
  agentId: string = "default"
): Promise<Message[]> {
  const backendUrl = await getBackendUrl();
  const endpoint = `${backendUrl}/agent/chat/${agentId}/history`;

  const response = await fetch(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get history: ${response.statusText}`);
  }

  const data = await response.json();
  return data.history || [];
}

export async function clearChatHistory(
  agentId: string = "default"
): Promise<void> {
  const backendUrl = await getBackendUrl();
  const endpoint = `${backendUrl}/agent/chat/${agentId}/clear`;

  const response = await fetch(endpoint, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to clear history: ${response.statusText}`);
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}

// ============================================================================
// STUDY MATERIALS API
// ============================================================================

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

export interface WorkflowStatus {
  status: string;
  output?: StudyMaterial;
  error?: string;
  currentStepDescription?: string;
  progress?: number;
  estimatedTimeRemaining?: string;
}

export async function generateStudyMaterials(
  pageContext: PageContext,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  materialTypes?: Array<'summary' | 'questions' | 'flashcards' | 'practice' | 'key_concepts'>
): Promise<{ instanceId: string; statusUrl: string }> {
  const backendUrl = await getBackendUrl();
  const endpoint = `${backendUrl}/study-materials/generate`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageContext,
      userId: "default",
      difficulty,
      materialTypes
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start study material generation: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    instanceId: data.instanceId,
    statusUrl: data.statusUrl
  };
}

export async function getStudyMaterialStatus(instanceId: string): Promise<WorkflowStatus> {
  const backendUrl = await getBackendUrl();
  const endpoint = `${backendUrl}/study-materials/status/${instanceId}`;

  const response = await fetch(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get workflow status: ${response.statusText}`);
  }

  const data = await response.json();
  return data.status;
}

export async function pollStudyMaterialStatus(
  instanceId: string,
  onProgress?: (status: WorkflowStatus) => void,
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<StudyMaterial> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getStudyMaterialStatus(instanceId);

    if (onProgress) {
      onProgress(status);
    }

    // Workflow completed successfully
    if (status.status === 'complete' && status.output) {
      return status.output;
    }

    // Workflow failed
    if (status.status === 'failed' || status.status === 'terminated' || status.status === 'errored') {
      throw new Error(status.error || 'Workflow failed');
    }

    // Still running, wait and retry
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error('Workflow timeout: Study material generation took too long');
}
