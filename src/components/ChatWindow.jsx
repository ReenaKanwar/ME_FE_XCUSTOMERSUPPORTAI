import React from 'react';
import './ChatWindow.css';

function ChatWindow({ messages, onLike, onDislike, onRate }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        return (
          <div key={index} className={`message-card ${isUser ? 'user-msg' : 'bot-msg'}`}>
            <img 
              src={isUser ? "/image 30.png" : "/image 29.png"} 
              alt={isUser ? "You" : "Customer Support AI"} 
              className="message-avatar" 
            />
            <div className="message-content">
              <div className="message-sender">
                {isUser ? 'You' : 'Customer Support AI'}
              </div>
              <p className="message-text">{msg.text}</p>
              
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                
                {!isUser && (
                  <span className="feedback-actions">
                    <button 
                      type="button" 
                      className={`action-btn thumbs-up ${msg.liked ? 'active' : ''}`}
                      onClick={() => onLike(index)}
                      title="Like response"
                    >
                      👍
                    </button>
                    <button 
                      type="button" 
                      className={`action-btn thumbs-down ${msg.disliked ? 'active' : ''}`}
                      onClick={() => onDislike(index)}
                      title="Dislike response"
                    >
                      👎
                    </button>
                  </span>
                )}
              </div>

              {!isUser && msg.liked && (
                <div className="rating-container">
                  <span className="rating-label">Rate this response:</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${msg.rating >= star ? 'filled' : 'outline'}`}
                        onClick={() => onRate(index, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isUser && msg.feedbackText && (
                <div className="submitted-feedback">
                  <strong>Feedback:</strong> {msg.feedbackText}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatWindow;
