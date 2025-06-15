import React from 'react';
import './ChatInput.css'; 

function ChatInput({ inputText, setInputText, handleSend, handleSave, setInputFocused }) {
  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
      />
      <button onClick={() => handleSend(inputText)}>Ask</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ChatInput;
