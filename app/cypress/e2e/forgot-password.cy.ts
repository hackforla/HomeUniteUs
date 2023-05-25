describe('Forgot Password', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/forgot_password', {statusCode: 200}).as(
      'forgotPassword',
    );

    cy.intercept('POST', '/api/auth/forgot_password/confirm', {
      statusCode: 200,
    }).as('forgotPasswordConfirm');
  });

  it('should let the user reset their password', () => {
    const email = 'test@gmail.com';
    const code = '123456';
    const password = 'Test123#';

    cy.visit('/signin');
    cy.findByRole('link', {name: /forgot password/i}).click();

    cy.url().should('include', '/forgot-password');

    cy.findByRole('textbox', {name: /email/i}).type(email);
    cy.findByRole('button', {name: /submit/i}).click();

    cy.wait('@forgotPassword')
      .its('request.body')
      .should('deep.equal', {email});

    cy.url().should('include', '/forgot-password/code');

    cy.findAllByRole('textbox').each(($el, index) => {
      cy.wrap($el).type(`${code[index]}`);
    });

    cy.findByRole('button', {name: /submit/i}).click();

    cy.url().should('include', '/forgot-password/reset');

    cy.get('#password').type(password);
    cy.get('#confirmPassword').type(password);
    cy.findByRole('button', {name: /submit/i}).click();

    cy.wait('@forgotPasswordConfirm')
      .its('request.body')
      .should('deep.equal', {email, password, confirmPassword: password, code});

    cy.url().should('include', '/forgot-password/success');
    cy.findByRole('link', {name: /sign in/i}).click();

    cy.url().should('include', '/signin');
  });
});
