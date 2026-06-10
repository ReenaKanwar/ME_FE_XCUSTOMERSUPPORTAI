import React from "react";
import "./Sidebar.css";

function Sidebar({ onNewQuery, onShowPastConversations, isOpen, onClose }) {
  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="new-query-wrapper" onClick={onNewQuery}>
            <img src="/image 29.png" alt="Bot" className="bot-icon" />
            <button className="new-query-btn" type="button">
              New Query?
            </button>
            <img src="/image 31.png" alt="edit" className="edit-icon" />
          </div>
        </div>

        <button className="past-btn" type="button" onClick={() => {
          onShowPastConversations();
          onClose();
        }}>
          Past Conversations
        </button>
      </div>
    </>
  );
}

export default Sidebar;
