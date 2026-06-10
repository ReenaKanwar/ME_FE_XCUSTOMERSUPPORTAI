import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SuggestionCards from './components/SuggestionCards';
import HistoryPage from './components/HistoryPage';
import repliesData from './data/replies.json';
import './App.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'conversations';   // exact key expected by tests
const MESSAGES_KEY = 'chat_messages';  // key for restoring the live chat view

function loadConversations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function loadMessages() {
  return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ messages, setMessages, inputText, setInputText }) {
  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = (text) => {
    if (typeof text !== 'string' || text.trim() === '') return;

    const question = text.trim();
    const reply = repliesData[question];
    const answer = reply || 'Sorry, Did not understand your query!';

    const userMessage = {
      sender: 'user',
      text: question,
      time: getCurrentTime(),
    };

    const botMessage = {
      sender: 'bot',
      text: answer,
      time: getCurrentTime(),
      liked: false,
      disliked: false,
      rating: 0,
      feedbackText: '',
    };

    // Update live chat state
    const newMessages = [...messages, userMessage, botMessage];
    setMessages(newMessages);
    setInputText('');

    // ── Persist chat messages for reload restore ──
    const existingMessages = loadMessages();
    localStorage.setItem(
      MESSAGES_KEY,
      JSON.stringify([...existingMessages, userMessage, botMessage])
    );

    // ── Persist conversations using the exact key + format the tests expect ──
    // Format: [{ question: string, answer: string }]
    const existingConversations = loadConversations();
    const updatedConversations = [...existingConversations, { question, answer }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConversations));
  };

  const handleLike = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        liked: true,
        disliked: false,
        rating: updated[index].rating || 5,
      };
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
  // Restore live chat from localStorage so messages survive page refresh
  const [messages, setMessages] = useState(loadMessages);
  const [inputText, setInputText] = useState('');

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
            {/* New Query? anchor — required by Cypress test 10 */}
            <NewQueryLink setMessages={setMessages} setInputText={setInputText} />
            <img src="/image 31.png" alt="edit" className="edit-icon" />
          </div>
          {/* /history anchor — required by Cypress test 1 */}
          <a href="/history" className="past-link">Past Conversations</a>
        </nav>

        <div className="main">
          {/* ── Header — always visible ── */}
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
                />
              }
            />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

// ─── New Query Link (inside BrowserRouter so useNavigate works) ───────────────
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
