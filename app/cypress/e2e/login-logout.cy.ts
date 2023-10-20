describe('Login and Logout using a username and password', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/auth/signin').as('signin');
        cy.intercept('POST', '/api/auth/signout').as('signout');
        cy.intercept('GET', '/api/auth/session').as('session');
        cy.intercept('GET', '/api/auth/refresh').as('refresh');
        cy.intercept('GET', '/api/auth/user/').as('user');
    
        if (Cypress.env('USE_MOCK')) {
            cy.intercept('POST', '/api/auth/signin', {
                statusCode: 200,
                body: {
                  "token": "fake.jwt.token",
                  "user": {
                    "email": "test@gmail.com"
                  }
                }
              }).as('signin');
            cy.intercept('POST', '/api/auth/signout', {statusCode: 200});
            cy.intercept('GET', '/api/auth/session', {statusCode: 401});
            cy.intercept('GET', '/api/auth/refresh', {statusCode: 401});
            cy.intercept('GET', '/api/auth/user/', {statusCode: 401});
        }
    });
  
    it('should log the user in, show the guest dashboard, and log out', () => {
      const email = Cypress.env('USE_MOCK') ? 'test@gmail.com' : Cypress.env('REAL_EMAIL');
      const password = Cypress.env('USE_MOCK') ? 'Test123#' : Cypress.env('REAL_PASSWORD');
  
      cy.visit('/signin'); 

      cy.wait('@session')
        .its('response.statusCode')
        .should('eq', 401);
      cy.wait('@refresh')
        .its('response.statusCode')
        .should('eq', 401);

      cy.findByRole('textbox', {name: /email/i}).type(email);
      cy.get('#password').type(password);
      cy.contains('button', 'Sign in').click()
  
      cy.wait('@signin')
        .its('response.body')
        .should((body) => {
            expect(body).to.have.property('user');
            expect(body.user).to.have.property('email', email)

            // Check if the request body contains a 'token' key with a non-empty string value
            expect(body).to.have.property('token');
            expect(body.token).to.be.a('string').and.not.to.be.empty;
        })

      cy.get('button[aria-label="Open settings"]').as('settingsBtn');
      cy.get('@settingsBtn').click();

      cy.contains('Logout').as('logoutBtn');
      cy.get('@logoutBtn').click();

      //cy.get('button[aria-label="Open settings"]').click();
      //cy.contains('Logout').click();
      cy.wait('@signout')
        .its('response.statusCode')
        .should('eq', 200);

      cy.url().should('include', '/signin');
    });
  });
  