import React from 'react';
import './SuggestionCards.css';

const cards = [
  { title: 'Hi, what is the weather', subtitle: 'Get immediate AI generated response' },
  { title: 'Hi, what is my location', subtitle: 'Get immediate AI generated response' },
  { title: 'Hi, what is the temperature', subtitle: 'Get immediate AI generated response' },
  { title: 'Hi, how are you', subtitle: 'Get immediate AI generated response' }
];

function SuggestionCards() {
  return (
    <div className="suggestions-grid">
      {cards.map((card, i) => (
        <div className="suggestion-card" key={i}>
          <h4>{card.title}</h4>
          <p>{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export default SuggestionCards;
