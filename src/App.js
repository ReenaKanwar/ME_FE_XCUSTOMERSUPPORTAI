import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SuggestionCards from './components/SuggestionCards';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import repliesData from './data/replies.json';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [ setInputFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Custom router state
  const [path, setPath] = useState(window.location.pathname);
  
  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Feedback Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('message'); // 'message' or 'conversation'
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [conversationRating, setConversationRating] = useState(0);

  // Past Conversations History list
  const [savedConversations, setSavedConversations] = useState(() => {
    const saved = localStorage.getItem('saved_conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyFilter, setHistoryFilter] = useState('All Ratings');
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(0);

  // Sync route path state
  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (newPath) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handle Query Submission
  const handleSend = (text) => {
    if (text.trim() === '') return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      time: getCurrentTime(),
    };

    // Predefined replies check
    const reply = repliesData[text.trim()];
    const botMessage = {
      sender: 'bot',
      text: reply || "Sorry, Did not understand your query!",
      time: getCurrentTime(),
      liked: false,
      disliked: false,
      rating: 0,
      feedbackText: ''
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');
    setInputFocused(true);
  };

  // Reset to initial state
  const handleNewQuery = () => {
    setMessages([]);
    setInputText('');
    setInputFocused(false);
    navigateTo('/');
  };

  // Like (Thumbs Up) triggers 5-star rating option
  const handleLike = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        liked: true,
        disliked: false,
        rating: updated[index].rating || 5 // default to 5 stars if not set
      };
      return updated;
    });
  };

  // Dislike (Thumbs Down) opens the feedback modal
  const handleDislike = (index) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        disliked: true,
        liked: false,
        rating: 0
      };
      return updated;
    });
    setModalType('message');
    setActiveFeedbackIndex(index);
    setFeedbackText('');
    setShowModal(true);
  };

  // Set message-level star rating
  const handleRate = (index, rating) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        rating
      };
      return updated;
    });
  };

  // Save button opens Conversation Level save dialog
  const handleSaveConversation = () => {
    if (messages.length === 0) {
      alert("No chat history to save!");
      return;
    }
    setModalType('conversation');
    setFeedbackText('');
    setConversationRating(5); // default rating
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedbackText('');
    setActiveFeedbackIndex(null);
  };

  // Modal Submit (handles both message-level and conversation-level feedback)
  const handleSubmitFeedback = () => {
    if (modalType === 'message') {
      // Message level
      if (activeFeedbackIndex !== null) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[activeFeedbackIndex] = {
            ...updated[activeFeedbackIndex],
            feedbackText
          };
          return updated;
        });
      }
    } else {
      // Conversation level - save full chat session
      const newConversation = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: getCurrentTime(),
        rating: conversationRating,
        feedback: feedbackText,
        messages: [...messages]
      };
      const updatedConversations = [...savedConversations, newConversation];
      setSavedConversations(updatedConversations);
      localStorage.setItem('saved_conversations', JSON.stringify(updatedConversations));
      alert("Conversation saved successfully!");
    }
    setShowModal(false);
    setFeedbackText('');
    setActiveFeedbackIndex(null);
  };

  // Theme change toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Filter conversation list based on ratings dropdown
  const filteredConversations = savedConversations.filter((conv) => {
    if (historyFilter === 'All Ratings') return true;
    const ratingNum = parseInt(historyFilter.split(' ')[0]);
    return conv.rating === ratingNum;
  });

  return (
    <div className={`app ${theme}`}>
      <Sidebar 
        onNewQuery={handleNewQuery}
        onShowPastConversations={() => navigateTo('/history')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main">
        {/* Top Header Bar */}
        <header className="mobile-header">
          <button 
            type="button" 
            className="menu-btn" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="header-title">Customer Support AI</h1>
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

        {/* Content Area */}
        {path === '/history' ? (
          <div className="history-view">
            <h2 className="title">Conversation History</h2>
            
            <div className="filter-row">
              <label htmlFor="rating-filter">Filter by rating</label>
              <select 
                id="rating-filter" 
                value={historyFilter} 
                onChange={(e) => {
                  setHistoryFilter(e.target.value);
                  setSelectedHistoryIndex(0);
                }}
              >
                <option value="All Ratings">All Ratings</option>
                <option value="5 Stars">5 Stars</option>
                <option value="4 Stars">4 Stars</option>
                <option value="3 Stars">3 Stars</option>
                <option value="2 Stars">2 Stars</option>
                <option value="1 Star">1 Star</option>
              </select>
            </div>

            {filteredConversations.length > 0 ? (
              <div className="history-layout">
                <div className="history-list">
                  <h3 className="section-title">Today's chats</h3>
                  {filteredConversations.map((conv, idx) => (
                    <div 
                      key={conv.id} 
                      className={`history-card-item ${selectedHistoryIndex === idx ? 'active' : ''}`}
                      onClick={() => setSelectedHistoryIndex(idx)}
                    >
                      <div className="history-card-info">
                        <span className="history-card-date">{conv.date} at {conv.time}</span>
                        <span className="history-card-rating">Rating: {conv.rating} ★</span>
                      </div>
                      {conv.feedback && (
                        <p className="history-card-preview">Feedback: {conv.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="history-detail-pane">
                  <h3 className="section-title">Chat Record</h3>
                  <div className="history-chat-bubbles">
                    {filteredConversations[selectedHistoryIndex]?.messages.map((msg, index) => (
                      <div key={index} className={`history-bubble-wrapper ${msg.sender}`}>
                        <img 
                          src={msg.sender === 'user' ? '/image 30.png' : '/image 29.png'} 
                          alt={msg.sender} 
                          className="history-avatar" 
                        />
                        <div className="history-bubble-content">
                          <span className="history-bubble-name">
                            {msg.sender === 'user' ? 'You' : 'Customer Support AI'}
                          </span>
                          <p className="history-bubble-text">{msg.text}</p>
                          <span className="history-bubble-time">{msg.time}</span>
                          
                          {msg.rating > 0 && (
                            <div className="history-bubble-rating">
                              Rating: {Array(msg.rating).fill('★').join('')}
                            </div>
                          )}
                          {msg.feedbackText && (
                            <div className="history-bubble-feedback">
                              Feedback: {msg.feedbackText}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-history">
                <p>No past conversations found for this rating filter.</p>
              </div>
            )}
            
            <button
              type="button"
              className="back-btn"
              onClick={() => navigateTo('/')}
            >
              Back to Chat
            </button>
          </div>
        ) : (
          /* Main Chat Area */
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
                  handleSave={handleSaveConversation}
                  setInputFocused={setInputFocused}
                />
              </>
            ) : (
              /* Initial Landing View */
              <div className="initial-chat-view">
                <h2 className="greeting">Hi, Please tell me your query!</h2>
                <img src="/image 29.png" alt="Bot Avatar" className="initial-bot-avatar" />
                
                <SuggestionCards onSelectCard={handleSend} />
                
                <ChatInput
                  inputText={inputText}
                  setInputText={setInputText}
                  handleSend={handleSend}
                  handleSave={handleSaveConversation}
                  setInputFocused={setInputFocused}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback & Saving Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modalType === 'message' ? '💡 Provide Additional Feedback' : '💾 Save Conversation'}
              </span>
              <button type="button" className="close-btn-cross" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {modalType === 'conversation' && (
                <div className="modal-rating-section">
                  <label>Overall Rating:</label>
                  <div className="modal-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`modal-star ${conversationRating >= star ? 'filled' : 'outline'}`}
                        onClick={() => setConversationRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <label htmlFor="feedback-text">
                {modalType === 'message' ? 'Feedback Notes:' : 'Subjective Feedback:'}
              </label>
              <textarea
                id="feedback-text"
                placeholder={modalType === 'message' ? 'What was wrong with this answer?' : 'How was your experience today?'}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-submit-btn" onClick={handleSubmitFeedback}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
