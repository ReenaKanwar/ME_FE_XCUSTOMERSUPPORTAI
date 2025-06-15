import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SuggestionCards from './components/SuggestionCards';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showPastConversations, setShowPastConversations] = useState(false);

  const qaData = {
    'Hi!': 'Hi There. How can I assist you today?',
    'How are you today?': "As an AI Language Model, I don't have the details",
    'How are you?': "As an AI Language Model, I don't have the details",
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = (text) => {
    if (text.trim() === '') return;

    const userMessage = {
      sender: 'user',
      text,
      time: getCurrentTime(),
    };

    const botMessage = {
      sender: 'bot',
      text: qaData[text.trim()] ||
        (text.toLowerCase().includes('how are you')
          ? "As an AI Language Model, I don't have feelings, but I'm here to help you!"
          : 'Let me look that up for you...'),
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');
  };

  const handleSave = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback('');
  };

  const handleSubmitFeedback = () => {
    alert('Feedback submitted: ' + feedback);
    setShowModal(false);
    setFeedback('');
  };

  return (
    <div className="app">
      <Sidebar onShowPastConversations={() => setShowPastConversations(true)} />

      <div className="main">
        {showPastConversations ? (
          <>
            <h1 className="bot-ai-title">Conversation History</h1>
            <h2 className="title">Today's Chats</h2>
            <div className="chat-container">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.sender === 'user' ? (
                    <img src="/image 30.png" alt="Me" className="me-icon" />
                  ) : (
                    <img src="/image 29.png" alt="Bot" className="ai-icon" />
                  )}
                  <div>
                    <p>{msg.text}</p>
                    <span className="time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="submit-button"
              style={{ alignSelf: 'flex-start', marginLeft: '20px' }}
              onClick={() => setShowPastConversations(false)}
            >
              Back to Chat
            </button>
          </>
        ) : inputFocused ? (
          <>
            <h1 className="bot-ai-title">Bot AI</h1>
            <div className="chat-container">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.sender === 'user' ? (
                    <img src="/image 30.png" alt="Me" className="me-icon" />
                  ) : (
                    <img src="/image 29.png" alt="Bot" className="ai-icon" />
                  )}
                  <div>
                    <p>{msg.text}</p>
                    <span className="time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSend={handleSend}
              handleSave={handleSave}
              setInputFocused={setInputFocused}
            />
          </>
        ) : (
          <>
            <h1 className="bot-ai-title">Bot AI</h1>
            <h2 className="title">How Can I Help You Today?</h2>
            <img src="/image 29.png" alt="Bot" className="bot-logo" />
            <SuggestionCards />
            <ChatWindow messages={messages} />
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSend={handleSend}
              handleSave={handleSave}
              setInputFocused={setInputFocused}
            />
          </>
        )}
      </div>

      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span>💡 Provide Additional Feedback</span>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <textarea
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmitFeedback}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
