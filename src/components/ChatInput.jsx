import React from 'react';
import './ChatInput.css'; 

function ChatInput({ inputText, setInputText, handleSend, handleSave, setInputFocused }) {
  const onSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    handleSend(inputText);
  };

  return (
    <form className="chat-input"  onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Please tell me about your query!"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onFocus={() => setInputFocused(true)}
      />
      <button type="submit" className="ask-btn">Ask</button>
      <button type="button" className="save-btn" onClick={handleSave}>Save</button>
    </form>
  );
}

export default ChatInput;
