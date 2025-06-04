/// <reference types="cypress" />

describe('Theme toggle and responsive layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('toggles between dark and light themes', () => {
    cy.get('body').should('have.class', 'theme-imperium-dark');
    cy.contains('mat-slide-toggle', 'Dark Mode').click();
    cy.get('body').should('have.class', 'light-theme');
    cy.contains('mat-slide-toggle', 'Dark Mode').click();
    cy.get('body').should('have.class', 'theme-imperium-dark');
  });

  it('adjusts header layout on small screens', () => {
    cy.viewport('iphone-6');
    cy.get('header.app-header').should('have.css', 'flex-direction', 'column');
    cy.viewport(1000, 660);
    cy.get('header.app-header').should('have.css', 'flex-direction', 'row');
  });
});
