import { useState, useRef, useEffect } from 'react';
import { Activity, Send } from 'lucide-react';
import PropTypes from 'prop-types';

function Chatbot({ zones }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'StadiumOps AI initialized. How can I assist you with current operations?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, zones })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setIsChatOpen(!isChatOpen)} aria-label="Toggle AI Assistant">
        <Activity size={28} />
      </button>

      {isChatOpen && (
        <div className="ai-assistant-popup animate-fade-in">
          <div className="card-title">
            <div className="flex items-center gap-2">
              <Activity size={18} />
              Ops Assistant AI
            </div>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => setIsChatOpen(false)} aria-label="Close Chat">✕</button>
          </div>
          <div className="chat-messages" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem', marginBottom: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message ai" style={{ opacity: 0.9 }}>Analyzing stadium data...</div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <label htmlFor="chatInput" className="sr-only" style={{ display: 'none' }}>Ask AI Assistant</label>
            <input 
              id="chatInput"
              type="text" 
              className="chat-input"
              placeholder="Ask for routing..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="icon-btn" disabled={!chatInput.trim() || isTyping} aria-label="Send Message">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

Chatbot.propTypes = {
  zones: PropTypes.array.isRequired,
};

export default Chatbot;
