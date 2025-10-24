import React from "react";
import type { Conversation } from "@/lib/conversations";
import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";
import { Plus, Trash, ChatCircle, BookOpen } from "@phosphor-icons/react";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="w-64 h-full flex flex-col bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-300 dark:border-neutral-800">
      {/* Header with New Conversation button */}
      <div className="p-3 border-b border-neutral-300 dark:border-neutral-800">
        <Button
          variant="secondary"
          size="base"
          className="w-full justify-center gap-2"
          onClick={onNewConversation}
        >
          <Plus size={16} weight="bold" />
          <span className="font-medium">New Chat</span>
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <ChatCircle size={32} className="text-neutral-400 dark:text-neutral-600 mb-2" />
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              No conversations yet
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === currentConversationId;
            const messageCount = conversation.messages.length;
            
            return (
              <Card
                key={conversation.id}
                className={`p-2 cursor-pointer transition-colors group relative ${
                  isActive
                    ? "bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-700"
                    : "bg-neutral-50 dark:bg-neutral-925 hover:bg-neutral-150 dark:hover:bg-neutral-850 border-transparent"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate mb-1">
                      {conversation.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                      <span>{formatDate(conversation.lastMessageTime)}</span>
                      {messageCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{messageCount} msg{messageCount !== 1 ? "s" : ""}</span>
                        </>
                      )}
                      {conversation.studyMaterial && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#F48120]" title="Has study materials">
                            <BookOpen size={12} weight="fill" />
                          </span>
                        </>
                      )}
                    </div>
                    {conversation.pageContext && (
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 truncate mt-1">
                        {conversation.pageContext.title}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded text-red-500 hover:text-red-600"
                    aria-label="Delete conversation"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

