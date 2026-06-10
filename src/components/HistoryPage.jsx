import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';

function HistoryPage({ savedConversations }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="history-view">
      <h2 className="history-title">Past Conversations</h2>

      {savedConversations.length > 0 ? (
        <div className="history-layout">
          <div className="history-list">
            <h3 className="section-title">Today's chats</h3>
            {savedConversations.map((conv, idx) => (
              <div
                key={conv.id}
                className={`history-card-item ${selectedIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="history-card-info">
                  <span className="history-card-date">{conv.date} at {conv.time}</span>
                </div>
                {conv.messages && conv.messages[0] && (
                  <p className="history-card-preview">{conv.messages[0].text}</p>
                )}
              </div>
            ))}
          </div>

          <div className="history-detail-pane">
            <h3 className="section-title">Chat Record</h3>
            <div className="history-chat-bubbles">
              {savedConversations[selectedIndex]?.messages?.map((msg, index) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-history">
          <p>No past conversations found.</p>
        </div>
      )}

      <Link to="/" className="back-btn">Back to Chat</Link>
    </div>
  );
}

export default HistoryPage;
