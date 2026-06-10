import React from 'react';
import './SuggestionCards.css';

const cards = [
  { title: 'Hello', subtitle: 'Get immediate AI generated response' },
  { title: 'My order has not arrived yet.', subtitle: 'Get immediate AI generated response' },
  { title: 'How can I reset my password?', subtitle: 'Get immediate AI generated response' },
  { title: 'I am unable to log in to my account.', subtitle: 'Get immediate AI generated response' }
];

function SuggestionCards({ onSelectCard }) {
  return (
    <div className="suggestions-grid">
      {cards.map((card, i) => (
        <div 
          className="suggestion-card" 
          key={i} 
          onClick={() => onSelectCard && onSelectCard(card.title)}
        >
          <h4>{card.title}</h4>
          <p>{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export default SuggestionCards;
