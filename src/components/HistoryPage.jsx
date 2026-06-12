import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';

function HistoryPage() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('conversations');
      if (stored) {
        setConversations(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse conversations from localStorage', e);
    }
  }, []);

  return (
    <div className="history-view">
      <h2 className="history-heading">Past Conversations</h2>

      <div className="history-conversations">
        {conversations.length > 0 ? (
          conversations.map((chat, index) => (
            <div key={index} className="history-chat-pair">
              <div className="history-question">
                <span className="history-label">You:</span>
                <p>{chat.question}</p>
              </div>
              <div className="history-answer">
                <span className="history-label">Customer Support AI:</span>
                <p>{chat.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-history">
            <p>No past conversations found.</p>
          </div>
        )}
      </div>

      <Link to="/" className="back-btn">Back to Chat</Link>
    </div>
  );
}

export default HistoryPage;
