import type { Message, StudyMaterial } from "./api";

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  lastMessageTime: string;
  messages: Message[];
  pageContext?: {
    title: string;
    url: string;
    text?: string;
    description?: string;
    mainContent?: string;
  };
  studyMaterial?: StudyMaterial;
}

const STORAGE_KEY = "clarvis_conversations";
const CURRENT_CONVERSATION_KEY = "clarvis_current_conversation";

/**
 * Get all conversations from storage
 */
export async function getAllConversations(): Promise<Conversation[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const conversations = result[STORAGE_KEY] || [];
      // Sort by last message time, most recent first
      conversations.sort((a: Conversation, b: Conversation) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      resolve(conversations);
    });
  });
}

/**
 * Get a specific conversation by ID
 */
export async function getConversation(id: string): Promise<Conversation | null> {
  const conversations = await getAllConversations();
  return conversations.find(c => c.id === id) || null;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  title?: string,
  pageContext?: { title: string; url: string; text?: string; description?: string; mainContent?: string }
): Promise<Conversation> {
  const conversations = await getAllConversations();
  
  const newConversation: Conversation = {
    id: Date.now().toString(),
    title: title || "New Conversation",
    timestamp: new Date().toISOString(),
    lastMessageTime: new Date().toISOString(),
    messages: [],
    pageContext,
  };

  conversations.push(newConversation);
  
  await chrome.storage.local.set({ [STORAGE_KEY]: conversations });
  await setCurrentConversationId(newConversation.id);
  
  return newConversation;
}

/**
 * Update a conversation
 */
export async function updateConversation(
  id: string,
  updates: Partial<Conversation>
): Promise<void> {
  const conversations = await getAllConversations();
  const index = conversations.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error(`Conversation ${id} not found`);
  }

  conversations[index] = {
    ...conversations[index],
    ...updates,
    lastMessageTime: new Date().toISOString(),
  };

  await chrome.storage.local.set({ [STORAGE_KEY]: conversations });
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
  const conversations = await getAllConversations();
  const filtered = conversations.filter(c => c.id !== id);
  await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
  
  // If we deleted the current conversation, clear it
  const currentId = await getCurrentConversationId();
  if (currentId === id) {
    await chrome.storage.local.remove(CURRENT_CONVERSATION_KEY);
  }
}

/**
 * Get current conversation ID
 */
export async function getCurrentConversationId(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([CURRENT_CONVERSATION_KEY], (result) => {
      resolve(result[CURRENT_CONVERSATION_KEY] || null);
    });
  });
}

/**
 * Set current conversation ID
 */
export async function setCurrentConversationId(id: string): Promise<void> {
  await chrome.storage.local.set({ [CURRENT_CONVERSATION_KEY]: id });
}

/**
 * Generate a title from the first user message
 */
export function generateConversationTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === "user");
  if (!firstUserMessage || !firstUserMessage.parts || firstUserMessage.parts.length === 0) {
    return "New Conversation";
  }
  
  const text = firstUserMessage.parts[0].text;
  // Take first 50 characters and add ellipsis if longer
  return text.length > 50 ? text.substring(0, 50) + "..." : text;
}

