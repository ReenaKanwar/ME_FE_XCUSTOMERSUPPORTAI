import React from "react";
import "./Sidebar.css";

function Sidebar({ onShowPastConversations }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/image 29.png" alt="Bot" className="bot-icon" />
        <span className="sidebar-title">New Chat</span>
        <img src="/image 31.png" alt="edit" className="edit-icon" />
      </div>

      <button className="past-btn" onClick={onShowPastConversations}>
        Past Conversations
      </button>
    </div>
  );
}

export default Sidebar;
