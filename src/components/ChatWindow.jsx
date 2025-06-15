import React from 'react';
import './ChatWindow.css';

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
        >
          <strong>{msg.sender === 'user' ? 'You' : 'Soul AI'}</strong>
          <p>{msg.text}</p>
          <span className="timestamp">{msg.time}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
