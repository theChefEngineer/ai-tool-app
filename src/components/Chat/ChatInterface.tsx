import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles,
  Loader2,
  Trash2,
  Download
} from 'lucide-react';
import { deepseekService } from '../../lib/deepseek';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI writing assistant. I can help you with paraphrasing, summarizing, translating, grammar checking, creative writing, and much more. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-79ed40b434d140a0a0fa9becefe4b5aa',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI writing assistant specializing in paraphrasing, summarizing, translation, grammar checking, and creative writing. Provide clear, helpful, and engaging responses. Be concise but thorough in your explanations.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage.content
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    toast.success('Message copied to clipboard!');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI writing assistant. I can help you with paraphrasing, summarizing, translating, grammar checking, creative writing, and much more. How can I assist you today?",
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
    toast.success('Chat cleared!');
  };

  const handleExportChat = () => {
    const chatData = {
      messages: messages,
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported!');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
          AI Chat Assistant
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Chat with your AI writing assistant for help with paraphrasing, summarizing, translation, and more
        </p>
      </motion.div>

      {/* Chat Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-2xl mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {messages.length - 1} messages
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportChat}
              className="px-3 py-2 glass-button rounded-xl flex items-center space-x-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearChat}
              className="px-3 py-2 glass-button rounded-xl flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 glass-card rounded-2xl p-6 overflow-hidden flex flex-col"
      >
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Message Header */}
                  <div className={`flex items-center space-x-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-center space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-600'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`relative group ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Copy Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyMessage(message.content, message.id)}
                      className={`absolute top-2 ${
                        message.role === 'user' ? 'left-2' : 'right-2'
                      } p-1.5 glass-button rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      AI Assistant
                    </span>
                  </div>
                  <div className="mr-8">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                        <span className="text-slate-600 dark:text-slate-400">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className="w-full p-4 glass-input rounded-xl resize-none min-h-[60px] max-h-32"
                disabled={isTyping}
                rows={1}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{inputMessage.length} characters</span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}