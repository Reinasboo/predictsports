'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI predictions analyst. Ask me to analyze matches, compare teams, or simulate outcomes.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Analyze Match', action: 'Analyze the upcoming Manchester United vs Liverpool match' },
    { label: 'Compare Teams', action: 'Compare Manchester City and Arsenal defense' },
    { label: 'Simulate Outcome', action: 'Simulate a Chelsea vs Tottenham upset scenario' },
    { label: 'Form Analysis', action: 'Which team has the best current form?' },
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (_query: string): string => {
    const responses = [
      'Based on the current form and xG metrics, Manchester United has a 52% chance of winning this match.',
      'The defensive stability index shows City is performing 23% better than Arsenal this season.',
      'In an upset scenario, we\'d expect tighter spacing in the midfield and more counter-attacking opportunities.',
      'Liverpool has won 5 of their last 6 games with an average xG of 1.8 per match.',
      'The weather conditions will favor teams with strong passing accuracy.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">AI Predictions Analyst</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-cyan-600/30 text-cyan-100'
                    : 'bg-slate-700/50 text-slate-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-sm text-slate-300">Analyzing...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEnd} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setInput(action.action);
                setTimeout(() => handleSendMessage(), 0);
              }}
              className="text-xs px-3 py-2 rounded border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/20 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about predictions, teams, or matches..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded text-white flex items-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
