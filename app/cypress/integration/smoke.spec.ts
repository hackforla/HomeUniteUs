describe('Smoke Test', () => {
  it('should visit the app', () => {
    cy.visit('/');

    cy.findByRole('heading', {
      name: /welcome to a safe place for youth/i,
    }).should('exist');

    cy.findByRole('link', {name: /host/i}).should('exist');
    cy.findByRole('link', {name: /guest/i}).should('exist');
    cy.findByRole('link', {name: /admin/i}).should('exist');
  });
});
