import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import AutoSuggest from "./AutoSuggest";
import {
  detectTriggerPattern,
  replaceTriggerWithSelection,
} from "../utils/autoSuggestUtils";

const WELCOME_MESSAGE = {
  id: 1,
  type: "assistant",
  content:
    "Hi! I'm your AI component generator. Describe the React component you'd like to create and I'll help you build it.",
  timestamp: new Date().toLocaleTimeString(),
};

export default function PromptComposer({
  onGenerateComponent,
  compilationStatus,
}) {
  // Debug compilation status changes and update ref
  useEffect(() => {
    compilationStatusRef.current = compilationStatus;
  }, [compilationStatus]);
  const [messages, setMessages] = useState(() => {
    // Clear localStorage on each page load/reload
    localStorage.removeItem("cf.chatMessages");
    return [WELCOME_MESSAGE];
  });

  const [currentInput, setCurrentInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const [autoSuggestData, setAutoSuggestData] = useState(null);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const compilationStatusRef = useRef(compilationStatus);

  // Persist messages to localStorage during session (cleared on page reload)
  useEffect(() => {
    localStorage.setItem("cf.chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!currentInput.trim() || isGenerating) return;

    const userPrompt = currentInput;
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsGenerating(true);

    try {
      // Generate or modify component with selected suggestions
      const result = await onGenerateComponent?.(
        userPrompt,
        selectedSuggestionIds
      );

      if (result.waitForCompilation) {
        // Show intermediate message while waiting for compilation
        const compilingMessage = {
          id: Date.now() + 1,
          type: "assistant",
          content: `⚙️ Code generated! Compiling and installing dependencies...`,
          timestamp: new Date().toLocaleTimeString(),
          isCompiling: true,
        };

        setMessages((prev) => [...prev, compilingMessage]);

        // Wait for compilation success (with timeout)
        let compilationSuccess = false;
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;

          if (compilationStatusRef.current === "success") {
            compilationSuccess = true;
            break;
          }

          if (compilationStatusRef.current === "error") {
            compilationSuccess = false;
            break;
          }
        }

        // Replace compiling message with success/error
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.isCompiling);
          const finalMessage = {
            id: Date.now() + 2,
            type: "assistant",
            content: compilationSuccess
              ? `✅ ${result.description}\n\nComponent ${
                  result.action === "replaced" ? "created" : "updated"
                } successfully! Dependencies installed and ready to use.`
              : `⚠️ Component generated but there may be compilation issues. Check the preview pane for details.`,
            timestamp: new Date().toLocaleTimeString(),
            isSuccess: compilationSuccess,
          };
          return [...filtered, finalMessage];
        });
      } else {
        // Immediate success message for non-compilation operations
        const successMessage = {
          id: Date.now() + 1,
          type: "assistant",
          content: `✅ ${result.description}`,
          timestamp: new Date().toLocaleTimeString(),
          isSuccess: true,
        };

        setMessages((prev) => [...prev, successMessage]);
      }

      setIsGenerating(false);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: `❌ Sorry, there was an error: ${error.message}\n\nPlease check your API configuration and try again.`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setCurrentInput(newValue);

    // Check for trigger pattern (keyword + space + /)
    const triggerResult = detectTriggerPattern(newValue, cursorPosition);

    if (triggerResult && triggerResult.suggestions.length > 0) {
      setAutoSuggestData(triggerResult);
      setShowAutoSuggest(true);
    } else {
      setShowAutoSuggest(false);
      setAutoSuggestData(null);
    }
  };

  const handleKeyPress = (e) => {
    // Don't handle Enter if auto-suggest is open
    if (showAutoSuggest) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAutoSuggestSelect = (suggestion) => {
    if (!autoSuggestData) return;

    const replacement = replaceTriggerWithSelection(
      currentInput,
      autoSuggestData.triggerPosition,
      suggestion.name,
      suggestion.id,
      suggestion.type
    );

    setCurrentInput(replacement.text);
    setSelectedSuggestionIds((prev) => [
      ...prev,
      {
        id: suggestion.id,
        name: suggestion.name,
        type: suggestion.type,
      },
    ]);
    setShowAutoSuggest(false);
    setAutoSuggestData(null);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          replacement.cursorPosition,
          replacement.cursorPosition
        );
      }
    }, 0);
  };

  const handleAutoSuggestClose = () => {
    setShowAutoSuggest(false);
    setAutoSuggestData(null);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-600">Component Generator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
            )}

            <div
              className={`max-w-[75%] ${
                message.type === "user" ? "order-first" : ""
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-gray-800 text-white"
                    : "bg-white border border-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
              <div
                className={`text-xs mt-1.5 px-1 ${
                  message.type === "user"
                    ? "text-right text-gray-400"
                    : "text-gray-400"
                }`}
              >
                {message.timestamp}
              </div>
            </div>

            {message.type === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">AI</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={currentInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Describe the component you want to create..."
              className="min-h-[60px] max-h-32 resize-none border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500/20 shadow-sm focus:shadow-md transition-all duration-200"
              disabled={isGenerating}
            />

            {/* Auto-suggest dropdown */}
            {showAutoSuggest && autoSuggestData && (
              <div className="absolute bottom-full mb-2 left-0 right-0">
                <AutoSuggest
                  suggestions={autoSuggestData.suggestions}
                  onSelect={handleAutoSuggestSelect}
                  onClose={handleAutoSuggestClose}
                />
              </div>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!currentInput.trim() || isGenerating}
            className="h-[60px] px-6 bg-gray-700 hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-700 hover:border-gray-600 font-semibold"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600 font-medium">
          <div className="flex items-center gap-6">
            <span>Press Shift+Enter for new line</span>
          </div>
          <div className="flex items-center gap-3">
            {selectedSuggestionIds.length > 0 && (
              <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded-md font-semibold">
                {selectedSuggestionIds.length} selected
              </span>
            )}
            <span className="text-gray-700">
              {currentInput.length} characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
