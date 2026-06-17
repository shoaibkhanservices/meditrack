import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { chatWithAssistantApi } from '../../services/api';
import type { ChatMessage } from '../../services/api';
import './Assistant.css';

const PRESETS = [
  'Help explain my symptom results',
  'When is chest pain an emergency?',
  'What are some common dehydration symptoms?',
  'What questions should I ask my doctor?',
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your MediTrack AI Assistant. I can help answer health-related questions, explain common medical terms, or assist you in understanding symptoms. \n\n*Please remember: I am an AI, not a doctor. For serious symptoms, please consult a medical professional or seek emergency services.*',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithAssistantApi([...messages, userMessage]);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I am your MediTrack AI Assistant. How can I help you today?',
        },
      ]);
      setError(null);
    }
  };

  return (
    <div className="assistant-screen">
      {/* Top Header */}
      <header className="assistant-header">
        <div className="assistant-header-title">
          <Sparkles size={20} className="assistant-spark-icon" />
          <h2>AI Health Assistant</h2>
        </div>
        <button
          type="button"
          className="assistant-clear-btn"
          onClick={clearChat}
          title="Clear Conversation"
        >
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>
      </header>

      {/* Message Feed */}
      <div className="assistant-chat-container">
        <div className="assistant-messages-list">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`assistant-msg-bubble ${isAssistant ? 'assistant' : 'user'}`}
              >
                <div className="assistant-msg-avatar">
                  {isAssistant ? <Sparkles size={14} /> : <User size={14} />}
                </div>
                <div className="assistant-msg-body">
                  <div className="assistant-msg-sender">
                    {isAssistant ? 'MediTrack AI' : 'You'}
                  </div>
                  <div className="assistant-msg-content">
                    {msg.content.split('\n').map((line, lIdx) => {
                      // Basic parser for list bold items for clinical rendering
                      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        return <li key={lIdx}>{line.replace(/^[\s]*[\*\-]\s+/, '')}</li>;
                      }
                      if (line.trim().startsWith('⚠️') || line.trim().toLowerCase().includes('emergency warning:')) {
                        return (
                          <div key={lIdx} className="assistant-alert-line">
                            {line}
                          </div>
                        );
                      }
                      return <p key={lIdx}>{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="assistant-msg-bubble assistant typing">
              <div className="assistant-msg-avatar">
                <Sparkles size={14} />
              </div>
              <div className="assistant-msg-body">
                <div className="assistant-msg-sender">MediTrack AI</div>
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="assistant-error-card">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggestions / Inputs */}
      <footer className="assistant-footer">
        {messages.length === 1 && (
          <div className="assistant-presets">
            <p className="presets-label">Common topics:</p>
            <div className="presets-list">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="preset-chip"
                  onClick={() => handleSend(preset)}
                >
                  <MessageSquare size={12} />
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="assistant-chat-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Type health questions or clarify symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="assistant-send-btn" disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}
