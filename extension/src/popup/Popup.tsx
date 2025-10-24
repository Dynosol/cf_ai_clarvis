import React, { useEffect, useState, useRef, useCallback } from "react";
import * as api from "@/lib/api";
import type { Message, PageContext, StudyMaterial } from "@/lib/api";
import * as conversations from "@/lib/conversations";
import type { Conversation } from "@/lib/conversations";

// Component imports
import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";
import { Avatar } from "@/components/avatar/Avatar";
import { Textarea } from "@/components/textarea/Textarea";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { ConversationSidebar } from "@/components/conversation-sidebar/ConversationSidebar";
import { StudyMaterialsView } from "@/components/study-materials/StudyMaterialsView";

// Icon imports
import {
  PaperPlaneTilt,
  Stop,
  List,
  BookOpen,
  Sparkle,
  ArrowClockwise
} from "@phosphor-icons/react";

export default function Popup() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const [agentUrl, setAgentUrl] = useState("http://localhost:8787");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState("");
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Conversation management
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Study materials state
  const [showStudyMaterials, setShowStudyMaterials] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [isGeneratingStudyMaterials, setIsGeneratingStudyMaterials] = useState(false);
  const [studyMaterialProgress, setStudyMaterialProgress] = useState<string>("");
  const [activeWorkflowInstanceId, setActiveWorkflowInstanceId] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      const convos = await conversations.getAllConversations();
      setAllConversations(convos);
      
      const currentId = await conversations.getCurrentConversationId();
      
      if (currentId && convos.find(c => c.id === currentId)) {
        // Load existing conversation
        setCurrentConversationId(currentId);
        const convo = await conversations.getConversation(currentId);
        if (convo) {
          setMessages(convo.messages);
          // Also restore page context if available
          if (convo.pageContext) {
            setPageContext(convo.pageContext as PageContext);
          }
          // Restore study materials if available
          if (convo.studyMaterial) {
            setStudyMaterial(convo.studyMaterial);
          }
        }
      } else if (convos.length > 0) {
        // Load most recent conversation
        const mostRecent = convos[0];
        setCurrentConversationId(mostRecent.id);
        setMessages(mostRecent.messages);
        if (mostRecent.pageContext) {
          setPageContext(mostRecent.pageContext as PageContext);
        }
        // Restore study materials if available
        if (mostRecent.studyMaterial) {
          setStudyMaterial(mostRecent.studyMaterial);
        }
        await conversations.setCurrentConversationId(mostRecent.id);
      }
      // Otherwise, stay with empty state until user creates a conversation
    };
    
    loadConversations();
  }, []);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await api.checkBackendHealth();
      setBackendHealthy(healthy);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Load agent URL from storage
  useEffect(() => {
    const loadUrl = async () => {
      const url = await api.getBackendUrl();
      setAgentUrl(url);
    };
    loadUrl();
  }, []);

  // Get page context from the active tab
  const refreshPageContext = useCallback(() => {
    chrome.runtime.sendMessage(
      { action: 'getActiveTabContext' },
      (response) => {
        if (response?.context) {
          setPageContext(response.context);
        } else if (response?.success === false) {
          console.warn('Could not get page context:', response.error);
          // Still show the UI, just without page context
        }
      }
    );
  }, []);

  // Refresh page context on mount and when popup becomes visible
  useEffect(() => {
    refreshPageContext();
    
    // Also refresh when the popup window gains focus (user switches back to it)
    const handleFocus = () => {
      refreshPageContext();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshPageContext]);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingText, scrollToBottom]);

  // Restore study materials workflow state on mount
  useEffect(() => {
    const restoreWorkflowState = async () => {
      const result = await chrome.storage.local.get(['studyMaterialsWorkflow']);
      const workflow = result.studyMaterialsWorkflow;
      
      if (workflow && workflow.isGenerating) {
        setIsGeneratingStudyMaterials(true);
        setStudyMaterialProgress(workflow.progress || "Resuming study material generation...");
        setActiveWorkflowInstanceId(workflow.instanceId);
        
        // Resume polling for the workflow
        try {
          const material = await api.pollStudyMaterialStatus(
            workflow.instanceId,
            (status) => {
              if (status.currentStepDescription) {
                const progressText = status.progress 
                  ? `${status.currentStepDescription} (${status.progress}%)`
                  : status.currentStepDescription;
                setStudyMaterialProgress(progressText);
              } else if (status.status === 'running') {
                setStudyMaterialProgress("Generating comprehensive study materials...");
              }
            },
            60,
            2000
          );
          
          setStudyMaterial(material);
          setShowStudyMaterials(true);
          setStudyMaterialProgress("");
          setIsGeneratingStudyMaterials(false);
          setActiveWorkflowInstanceId(null);
          
          // Save study material to the conversation that was active when workflow started
          const conversationIdToUpdate = workflow.conversationId || currentConversationId;
          if (conversationIdToUpdate) {
            await conversations.updateConversation(conversationIdToUpdate, {
              studyMaterial: material
            });
            // Refresh conversations list to show the update
            setAllConversations(await conversations.getAllConversations());
          }
          
          // Clear the workflow state from storage
          await chrome.storage.local.remove(['studyMaterialsWorkflow']);
        } catch (error) {
          console.error("Error resuming workflow:", error);
          setStudyMaterialProgress("");
          setIsGeneratingStudyMaterials(false);
          setActiveWorkflowInstanceId(null);
          await chrome.storage.local.remove(['studyMaterialsWorkflow']);
          alert(`Failed to resume study material generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };
    
    restoreWorkflowState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount, using the stored conversationId from workflow

  // Persist study materials workflow state when it changes
  useEffect(() => {
    const saveWorkflowState = async () => {
      if (isGeneratingStudyMaterials && activeWorkflowInstanceId) {
        await chrome.storage.local.set({
          studyMaterialsWorkflow: {
            isGenerating: true,
            instanceId: activeWorkflowInstanceId,
            progress: studyMaterialProgress,
            timestamp: new Date().toISOString(),
            conversationId: currentConversationId
          }
        });
      } else if (!isGeneratingStudyMaterials) {
        // Clear workflow state when not generating
        await chrome.storage.local.remove(['studyMaterialsWorkflow']);
      }
    };
    
    saveWorkflowState();
  }, [isGeneratingStudyMaterials, activeWorkflowInstanceId, studyMaterialProgress, currentConversationId]);

  const [agentInput, setAgentInput] = useState("");
  const handleAgentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAgentInput(e.target.value);
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim() || isStreaming) return;

    const userMessage = agentInput;
    setAgentInput("");

    // Create new conversation if none exists
    let conversationId = currentConversationId;
    const initialMessages = [...messages];
    
    if (!conversationId) {
      const newConvo = await conversations.createConversation(
        undefined,
        pageContext ? {
          title: pageContext.title,
          url: pageContext.url,
          text: pageContext.text,
          description: pageContext.description,
          mainContent: pageContext.mainContent
        } : undefined
      );
      conversationId = newConvo.id;
      setCurrentConversationId(conversationId);
      setAllConversations(await conversations.getAllConversations());
      
      // If we have page context and this is a brand new conversation, inject it as first message
      if (pageContext && pageContext.mainContent && initialMessages.length === 0) {
        const contextMessage: Message = {
          id: Date.now().toString(),
          role: "system",
          parts: [{
            type: "text",
            text: `📄 **Page Context**\n\n**Title:** ${pageContext.title}\n**URL:** ${pageContext.url}\n\n**Content:**\n${pageContext.mainContent.substring(0, 2000)}${pageContext.mainContent.length > 2000 ? '...' : ''}`
          }],
          timestamp: new Date().toISOString(),
        };
        const messagesWithContext = [...initialMessages, contextMessage];
        setMessages(messagesWithContext);
        
        // Add user message to the chat
        const newUserMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "user",
          parts: [{ type: "text", text: userMessage }],
          timestamp: new Date().toISOString(),
        };
        
        const updatedMessages = [...messagesWithContext, newUserMessage];
        setMessages(updatedMessages);
        setIsStreaming(true);
        setCurrentStreamingText("");

        const controller = new AbortController();
        setAbortController(controller);

        try {
          // Send to backend with page context as separate metadata
          const fullResponse = await api.sendChatMessage(
            updatedMessages,
            "default",
            (accumulatedText) => {
              setCurrentStreamingText(accumulatedText);
            },
            pageContext || undefined,
            controller.signal
          );

          // Add assistant message
          const assistantMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            parts: [{ type: "text", text: fullResponse }],
            timestamp: new Date().toISOString(),
          };

          const finalMessages = [...updatedMessages, assistantMessage];
          setMessages(finalMessages);
          setCurrentStreamingText("");
          
          // Update conversation with new messages and auto-generate title if needed
          if (conversationId) {
            const currentConvo = await conversations.getConversation(conversationId);
            const shouldUpdateTitle = currentConvo && currentConvo.title === "New Conversation" && finalMessages.length >= 2;
            
            await conversations.updateConversation(conversationId, {
              messages: finalMessages,
              title: shouldUpdateTitle ? conversations.generateConversationTitle(finalMessages) : currentConvo?.title,
            });
            setAllConversations(await conversations.getAllConversations());
          }
        } catch (error) {
          // if stop button was pressed
          if (error instanceof Error && error.message === "Stream interrupted") {
            console.log("Stream interrupted, aborting chat");
          } else {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              parts: [{ 
                type: "text", 
                text: `Error: ${error instanceof Error ? error.message : "Failed to connect to backend"}` 
              }],
              timestamp: new Date().toISOString(),
            };
            const finalMessages = [...updatedMessages, errorMessage];
            setMessages(finalMessages);
            
            // Still save the conversation with error
            if (conversationId) {
              await conversations.updateConversation(conversationId, {
                messages: finalMessages,
              });
            }
          }
        } finally {
          setIsStreaming(false);
          setAbortController(null);
        }
        return; // Early return after handling new conversation with context
      }
    }

    // Add user message to the chat (without embedding page context in the message)
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: userMessage }],
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...initialMessages, newUserMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setCurrentStreamingText("");

    const controller = new AbortController();
    setAbortController(controller);

    

    try {
      // Send to backend with page context as separate metadata
      const fullResponse = await api.sendChatMessage(
        updatedMessages,
        "default",
        (accumulatedText) => {
          // The callback receives the full accumulated text, not incremental chunks
          setCurrentStreamingText(accumulatedText);
        },
        pageContext || undefined,
        controller.signal // also sending the abort signal back
      );

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        parts: [{ type: "text", text: fullResponse }],
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setCurrentStreamingText("");
      
      // Update conversation with new messages and auto-generate title if needed
      if (conversationId) {
        const currentConvo = await conversations.getConversation(conversationId);
        const shouldUpdateTitle = currentConvo && currentConvo.title === "New Conversation" && finalMessages.length >= 2;
        
        await conversations.updateConversation(conversationId, {
          messages: finalMessages,
          title: shouldUpdateTitle ? conversations.generateConversationTitle(finalMessages) : currentConvo?.title,
        });
        setAllConversations(await conversations.getAllConversations());
      }
    } catch (error) {
      // if stop button was pressed
      if (error instanceof Error && error.message === "Stream interrupted") {
        console.log("Stream interrupted, aborting chat");
      } else {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          parts: [{ 
            type: "text", 
            text: `Error: ${error instanceof Error ? error.message : "Failed to connect to backend"}` 
          }],
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
        
        // Still save the conversation with error
        if (conversationId) {
          await conversations.updateConversation(conversationId, {
            messages: finalMessages,
          });
        }
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  // this is what the stop button does
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsStreaming(false);
    }
  };


  const handleNewConversation = async () => {
    // Get fresh page context from the current active tab
    chrome.runtime.sendMessage(
      { action: 'getActiveTabContext' },
      async (response) => {
        const freshPageContext = response?.context || pageContext;
        
        const newConvo = await conversations.createConversation(
          undefined,
          freshPageContext ? {
            title: freshPageContext.title,
            url: freshPageContext.url,
            text: freshPageContext.text,
            description: freshPageContext.description,
            mainContent: freshPageContext.mainContent
          } : undefined
        );
        
        // If we have page context, inject it as an initial system message
        const initialMessages: Message[] = [];
        if (freshPageContext && freshPageContext.mainContent) {
          const contextMessage: Message = {
            id: Date.now().toString(),
            role: "system",
            parts: [{
              type: "text",
              text: `📄 **Page Context**\n\n**Title:** ${freshPageContext.title}\n**URL:** ${freshPageContext.url}\n\n**Content:**\n${freshPageContext.mainContent.substring(0, 2000)}${freshPageContext.mainContent.length > 2000 ? '...' : ''}`
            }],
            timestamp: new Date().toISOString(),
          };
          initialMessages.push(contextMessage);
          
          // Update the conversation with the initial message
          await conversations.updateConversation(newConvo.id, {
            messages: initialMessages,
          });
        }
        
        setCurrentConversationId(newConvo.id);
        setMessages(initialMessages);
        setCurrentStreamingText("");
        setPageContext(freshPageContext);
        setAllConversations(await conversations.getAllConversations());
      }
    );
  };

  const handleSelectConversation = async (id: string) => {
    console.log('Attempting to select conversation:', id);
    
    // Don't allow switching if currently streaming
    if (isStreaming) {
      console.log('Cannot switch - currently streaming');
      return;
    }
    
    // Don't reload if already selected
    if (id === currentConversationId) {
      console.log('Already viewing this conversation');
      return;
    }
    
    const convo = await conversations.getConversation(id);
    console.log('Retrieved conversation:', convo ? `${convo.title} with ${convo.messages.length} messages` : 'not found');
    
    if (convo) {
      // Clear current state first
      setCurrentStreamingText("");
      
      // Update conversation ID immediately for UI feedback
      setCurrentConversationId(id);
      await conversations.setCurrentConversationId(id);
      
      // Load messages - this is critical for seeing historical chats
      // Use a completely new array to ensure React detects the change
      const messagesToLoad = convo.messages.map(m => ({ ...m }));
      setMessages(messagesToLoad);
      
      // Update page context to match the conversation's stored context if available
      if (convo.pageContext) {
        setPageContext(convo.pageContext as PageContext);
      }
      
      // Load study materials if available
      if (convo.studyMaterial) {
        setStudyMaterial(convo.studyMaterial);
      } else {
        setStudyMaterial(null);
      }
      
      console.log(`✓ Successfully loaded conversation ${id} with ${messagesToLoad.length} messages`);
    } else {
      console.error(`Failed to load conversation ${id}`);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    await conversations.deleteConversation(id);
    const updatedConvos = await conversations.getAllConversations();
    setAllConversations(updatedConvos);
    
    // If we deleted the current conversation, clear or switch to another
    if (id === currentConversationId) {
      if (updatedConvos.length > 0) {
        handleSelectConversation(updatedConvos[0].id);
      } else {
        setCurrentConversationId(null);
        setMessages([]);
        setCurrentStreamingText("");
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleGenerateStudyMaterials = async () => {
    if (!pageContext) {
      alert("No page context available. Please refresh the page and try again.");
      return;
    }

    setIsGeneratingStudyMaterials(true);
    setStudyMaterialProgress("Starting study material generation...");

    try {
      // Start the workflow
      const { instanceId } = await api.generateStudyMaterials(pageContext, 'intermediate');
      
      // Store the workflow instance ID for persistence
      setActiveWorkflowInstanceId(instanceId);
      setStudyMaterialProgress("Analyzing page content...");

      // Poll for results with detailed progress updates
      const material = await api.pollStudyMaterialStatus(
        instanceId,
        (status) => {
          // Update progress based on workflow status with detailed information
          if (status.currentStepDescription) {
            let progressText = status.currentStepDescription;
            
            // Add progress percentage if available
            if (status.progress !== undefined) {
              progressText += ` (${status.progress}%)`;
            }
            
            // Add time estimate if available
            if (status.estimatedTimeRemaining) {
              progressText += ` • ~${status.estimatedTimeRemaining} remaining`;
            }
            
            setStudyMaterialProgress(progressText);
          } else if (status.status === 'running') {
            setStudyMaterialProgress("Generating comprehensive study materials...");
          }
        },
        60, // max attempts
        2000 // interval
      );

      setStudyMaterial(material);
      setShowStudyMaterials(true);
      setStudyMaterialProgress("");
      setActiveWorkflowInstanceId(null);
      
      // Save study material to the current conversation
      if (currentConversationId) {
        await conversations.updateConversation(currentConversationId, {
          studyMaterial: material
        });
        // Refresh conversations list to show the update
        setAllConversations(await conversations.getAllConversations());
      }
    } catch (error) {
      console.error("Error generating study materials:", error);
      alert(`Failed to generate study materials: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStudyMaterialProgress("");
      setActiveWorkflowInstanceId(null);
    } finally {
      setIsGeneratingStudyMaterials(false);
    }
  };

  return (
    <div className="w-full h-[600px] flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Show Study Materials View if active */}
      {showStudyMaterials && studyMaterial ? (
        <StudyMaterialsView
          material={studyMaterial}
          onClose={() => setShowStudyMaterials(false)}
        />
      ) : (
        <>
          {/* Sidebar */}
          {showSidebar && (
            <ConversationSidebar
              conversations={allConversations}
              currentConversationId={currentConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          )}
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
        {/* Header with controls */}
        <div className="p-2 border-b border-neutral-300 dark:border-neutral-800 flex items-center justify-between min-w-0">
          <Button
            variant="ghost"
            size="sm"
            shape="square"
            className="rounded h-7 w-7"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle sidebar"
          >
            <List size={18} />
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Refresh Page Context Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={refreshPageContext}
              title="Refresh page context"
            >
              <ArrowClockwise size={14} />
            </Button>
            
            {/* View Study Materials Button - Shows if study materials exist */}
            {studyMaterial && !isGeneratingStudyMaterials && (
              <Button
                variant="tertiary"
                size="sm"
                className="text-xs"
                onClick={() => setShowStudyMaterials(true)}
              >
                <BookOpen size={14} className="mr-1" />
                View Study Guide
              </Button>
            )}
            
            {/* Generate Study Materials Button */}
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={handleGenerateStudyMaterials}
              disabled={isGeneratingStudyMaterials || !pageContext || backendHealthy === false}
            >
              {isGeneratingStudyMaterials ? (
                <>
                  <Sparkle size={14} className="mr-1 animate-pulse" />
                  Generating...
                </>
              ) : studyMaterial ? (
                <>
                  <Sparkle size={14} className="mr-1" />
                  Regenerate
                </>
              ) : (
                <>
                  <BookOpen size={14} className="mr-1" />
                  Generate Study Guide
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        {isGeneratingStudyMaterials && studyMaterialProgress && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
              <Sparkle size={14} className="animate-pulse" />
              <span>{studyMaterialProgress}</span>
              {activeWorkflowInstanceId && (
                <span className="text-blue-500 dark:text-blue-400 text-[10px]">
                  (Session restored)
                </span>
              )}
            </div>
          </div>
        )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {/* Backend health indicator */}
        {backendHealthy === false && (
          <div className="bg-red-500/10 text-red-500 p-2 rounded text-xs text-center">
            ⚠️ Backend not connected. Check if backend is running at {agentUrl}
          </div>
        )}

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <Card className="p-6 bg-neutral-100 dark:bg-neutral-900">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-base">Start a conversation</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Ask me anything!
                </p>
              </div>
            </Card>
          </div>
        )}

        {messages.map((m, index) => {
          const isUser = m.role === "user";
          const isSystem = m.role === "system";
          const showAvatar =
            index === 0 || messages[index - 1]?.role !== m.role;

          // System messages have special full-width styling
          if (isSystem) {
            return (
              <div key={m.id} className="w-full min-w-0">
                <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 overflow-hidden max-w-full">
                  <div className="text-xs">
                    {m.parts?.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <MemoizedMarkdown
                            key={i}
                            id={`${m.id}-${i}`}
                            content={part.text}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </Card>
              </div>
            );
          }

          return (
            <div key={m.id}>
              <div
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] min-w-0 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {showAvatar && !isUser ? (
                    <Avatar username={"AI"} />
                  ) : (
                    !isUser && <div className="w-8" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div>
                      {m.parts?.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <div key={i}>
                              <Card
                                className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-hidden max-w-full ${
                                  isUser
                                    ? "rounded-br-none"
                                    : "rounded-bl-none"
                                }`}
                              >
                                <MemoizedMarkdown
                                  id={`${m.id}-${i}`}
                                  content={part.text}
                                />
                              </Card>
                              <p
                                className={`text-xs text-neutral-500 mt-1 ${
                                  isUser ? "text-right" : "text-left"
                                }`}
                              >
                                {formatTime(
                                  m.timestamp
                                    ? new Date(m.timestamp)
                                    : new Date()
                                )}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Show streaming message */}
        {isStreaming && currentStreamingText && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%] min-w-0">
              <Avatar username={"AI"} />
              <div className="min-w-0 flex-1">
                <Card className="p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 rounded-bl-none overflow-hidden max-w-full">
                  <MemoizedMarkdown
                    id="streaming"
                    content={currentStreamingText}
                  />
                </Card>
                <p className="text-xs text-neutral-500 mt-1 text-left">
                  Typing...
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAgentSubmit(e);
          setTextareaHeight("auto");
        }}
        className="p-3 border-t border-neutral-300 dark:border-neutral-800"
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Ask about this page..."
              className="w-full border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F48120] dark:bg-neutral-900 text-sm resize-none pr-10"
              value={agentInput}
              onChange={(e) => {
                handleAgentInputChange(e);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
                setTextareaHeight(`${e.target.scrollHeight}px`);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  handleAgentSubmit(e as unknown as React.FormEvent);
                  setTextareaHeight("auto");
                }
              }}
              rows={2}
              style={{ height: textareaHeight }}
            />
            <div className="absolute bottom-2 right-2">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
                  aria-label="Stop generating"
                >
                  <Stop size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="p-1.5 rounded-full bg-[#F48120] text-white hover:bg-[#d67018] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!agentInput.trim() || backendHealthy === false}
                  aria-label="Send message"
                >
                  <PaperPlaneTilt size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      </div>
        </>
      )}
    </div>
  );
}

