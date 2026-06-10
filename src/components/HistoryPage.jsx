import React from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';

// Read directly from localStorage so this page always has up-to-date data
// even after a full-page reload or direct navigation to /history.
// Expected format: [{ question: string, answer: string }]
function HistoryPage() {
  const conversations = JSON.parse(localStorage.getItem('conversations')) || [];

  return (
    <div className="history-view">
      {/* Always visible — not conditional — required by Cypress test */}
      <h2 className="history-heading">Past Conversations</h2>

      <div className="history-conversations">
        {conversations.length > 0 ? (
          conversations.map((chat, index) => (
            <div key={index} className="history-chat-pair">
              <div className="history-question">
                <span className="history-label">You</span>
                <p>{chat.question}</p>
              </div>
              <div className="history-answer">
                <span className="history-label">Customer Support AI</span>
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
