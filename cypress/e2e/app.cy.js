describe('Customer Support AI - Full Test Suite', () => {

  beforeEach(() => {
    // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
    cy.visit('/');
  });

  // ─── Test 1: Navigation link to /history ──────────────────────────────────
  it('should have a visible link to /history and navigate to it', () => {
    cy.get('a[href="/history"]').should('be.visible');
    cy.get('a[href="/history"]').first().click();
    cy.url().should('include', '/history');
  });

  // ─── Test 2 & 3: Header with h1 visible on desktop and mobile ────────────
  it('should display a visible header with h1 "Customer Support AI"', () => {
    cy.get('header').should('be.visible');
    cy.get('header h1').should('be.visible').and('contain.text', 'Customer Support AI');
  });

  it('should display the header on mobile viewport', () => {
    cy.viewport(375, 667);
    cy.get('header').should('be.visible');
    cy.get('header h1').should('be.visible').and('contain.text', 'Customer Support AI');
  });

  // ─── Test 4: Input field exists and typing works without runtime errors ───
  it('should have the input field and allow typing without errors', () => {
    cy.get('input[placeholder="Please tell me about your query!"]').should('be.visible');
    cy.get('input[placeholder="Please tell me about your query!"]').click().type('Hello');
    cy.get('input[placeholder="Please tell me about your query!"]').should('have.value', 'Hello');
  });

  // ─── Test 5: Submit query and check response ──────────────────────────────
  it('should submit "Hello" and show correct bot response', () => {
    cy.get('input[placeholder="Please tell me about your query!"]').type('Hello');
    cy.get('button[type="submit"]').click();
    cy.contains('Hello! How can I assist you today?').should('be.visible');
  });

  // ─── Test 6: Static JSON response ────────────────────────────────────────
  it('should return the correct static JSON response for contact support query', () => {
    cy.get('input[placeholder="Please tell me about your query!"]').type('How do I contact customer support?');
    cy.get('button[type="submit"]').click();
    cy.contains('You can contact our customer support via email at support@example.com or call us at +1-800-123-4567.').should('be.visible');
  });

  // ─── Test 7: Default response for unknown query ───────────────────────────
  it('should show default response for unknown query', () => {
    cy.get('input[placeholder="Please tell me about your query!"]').type('Something random that has no answer');
    cy.get('button[type="submit"]').click();
    cy.contains('Sorry, Did not understand your query!').should('be.visible');
  });

  // ─── Test 8: /history page shows "Past Conversations" ────────────────────
  it('should show "Past Conversations" heading on the history page', () => {
    cy.visit('/history');
    cy.contains('Past Conversations').should('be.visible');
  });

  // ─── Test 9: localStorage persistence across page refresh ────────────────
  it('should persist conversations in localStorage after page refresh', () => {
    cy.get('input[placeholder="Please tell me about your query!"]').type('Hello');
    cy.get('button[type="submit"]').click();
    cy.contains('Hello! How can I assist you today?').should('be.visible');

    // Reload the page
    cy.reload();

    // Conversation should still be visible
    cy.contains('Hello! How can I assist you today?').should('be.visible');

    // Visit /history - should show previous conversation
    cy.visit('/history');
    cy.contains('Past Conversations').should('be.visible');
  });

  // ─── Test 10: New Query? link ─────────────────────────────────────────────
  it('should have a "New Query?" link that navigates to / and clears input', () => {
    cy.get('a[href="/"]').contains('New Query?').should('be.visible');
    cy.get('input[placeholder="Please tell me about your query!"]').type('Hello');
    cy.get('button[type="submit"]').click();
    cy.contains('Hello! How can I assist you today?').should('be.visible');
    cy.get('a[href="/"]').contains('New Query?').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('input[placeholder="Please tell me about your query!"]').should('have.value', '');
  });

});
