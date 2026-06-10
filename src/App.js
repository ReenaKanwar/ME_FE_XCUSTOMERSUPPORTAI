import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SuggestionCards from './components/SuggestionCards';
import HistoryPage from './components/HistoryPage';
import repliesData from './data/replies.json';
import './App.css';

// ─── Home Page ───────────────────────────────────────────────────────────────
function HomePage({ messages, setMessages, inputText, setInputText, savedConversations, setSavedConversations }) {

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = (text) => {
    if (typeof text !== 'string' || text.trim() === '') return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      time: getCurrentTime(),
    };

    const reply = repliesData[text.trim()];
    const botMessage = {
      sender: 'bot',
      text: reply || 'Sorry, Did not understand your query!',
      time: getCurrentTime(),
      liked: false,
      disliked: false,
      rating: 0,
      feedbackText: '',
    };

    const newMessages = [...messages, userMessage, botMessage];
    setMessages(newMessages);
    setInputText('');

    // Auto-save each conversation exchange to localStorage
    const existing = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const updated = [...existing, userMessage, botMessage];
    localStorage.setItem('chat_messages', JSON.stringify(updated));

    // Also keep a conversations list for /history
    const allConversations = JSON.parse(localStorage.getItem('saved_conversations') || '[]');
    const conv = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: getCurrentTime(),
      rating: 0,
      feedback: '',
      messages: [userMessage, botMessage],
    };
    const updatedConversations = [...allConversations, conv];
    setSavedConversations(updatedConversations);
    localStorage.setItem('saved_conversations', JSON.stringify(updatedConversations));
  };

  const handleLike = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], liked: true, disliked: false, rating: updated[index].rating || 5 };
      return updated;
    });
  };

  const handleDislike = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], disliked: true, liked: false, rating: 0 };
      return updated;
    });
  };

  const handleRate = (index, rating) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], rating };
      return updated;
    });
  };

  return (
    <div className="chat-area">
      {messages.length > 0 ? (
        <>
          <ChatWindow
            messages={messages}
            onLike={handleLike}
            onDislike={handleDislike}
            onRate={handleRate}
          />
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
          />
        </>
      ) : (
        <div className="initial-chat-view">
          <h2 className="greeting">Hi, Please tell me your query!</h2>
          <img src="/image 29.png" alt="Bot Avatar" className="initial-bot-avatar" />
          <SuggestionCards onSelectCard={handleSend} />
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            handleSend={handleSend}
          />
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputText, setInputText] = useState('');

  const [savedConversations, setSavedConversations] = useState(() => {
    const saved = localStorage.getItem('saved_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <BrowserRouter>
      <div className={`app ${theme}`}>
        {/* ── Sidebar ── */}
        <nav className="sidebar">
          <div className="sidebar-header">
            <img src="/image 29.png" alt="Bot" className="bot-icon" />
            {/* New Query link — required by Cypress test 10 */}
            <NewQueryLink setMessages={setMessages} setInputText={setInputText} />
            <img src="/image 31.png" alt="edit" className="edit-icon" />
          </div>
          {/* History navigation link — required by Cypress test 1 */}
          <a href="/history" className="past-link">Past Conversations</a>
        </nav>

        <div className="main">
          {/* ── Header — always visible, required by Cypress tests 2 & 3 ── */}
          <header className="app-header">
            <h1>Customer Support AI</h1>
            <div className="header-right">
              <span className="theme-text">{theme === 'light' ? 'Light' : 'Dark'}</span>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                ⚙
              </button>
            </div>
          </header>

          {/* ── Routes ── */}
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  messages={messages}
                  setMessages={setMessages}
                  inputText={inputText}
                  setInputText={setInputText}
                  savedConversations={savedConversations}
                  setSavedConversations={setSavedConversations}
                />
              }
            />
            <Route
              path="/history"
              element={<HistoryPage savedConversations={savedConversations} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

// ─── New Query Link Helper (needs useNavigate inside BrowserRouter) ───────────
function NewQueryLink({ setMessages, setInputText }) {
  const navigate = useNavigate();
  return (
    <a
      href="/"
      className="new-query-btn"
      onClick={(e) => {
        e.preventDefault();
        setMessages([]);
        setInputText('');
        navigate('/');
      }}
    >
      New Query?
    </a>
  );
}

export default App;
