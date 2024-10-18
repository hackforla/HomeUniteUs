import {faker} from '@faker-js/faker';

describe('Sign Up', () => {
  beforeEach(() => {
    if (Cypress.env('USE_MOCK')) {
      // While Mocking always return a successful status code
      cy.intercept('POST', '/api/auth/signup', {
        statusCode: 200,
      }).as('signUp');
    } else {
      // cy.intercept without a request will not stub out the real API call
      cy.intercept('POST', '/api/auth/signup').as('signUp');
    }

    cy.intercept('GET', '/api/auth/session', req => {
      req.reply({
        statusCode: 401,
      });
    }).as('session');

    cy.intercept('GET', '/api/auth/refresh', req => {
      req.reply({
        statusCode: 401,
      });
    }).as('refresh');
  });

  it('user can sign up as a coordinator', () => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: 'host',
      password: 'Test123!',
    };

    cy.visit('/signup');

    cy.findByRole('button', {name: /select account/i}).should('be.disabled');

    cy.findByRole('button', {name: /coordinator/i}).click();

    cy.findByRole('button', {name: /join as coordinator/i})
      .should('be.enabled')
      .click();

    cy.url().should('include', '/signup/coordinator');

    cy.findByRole('button', {name: /sign up/i}).should('be.disabled');

    cy.findByLabelText(/first name/i).type(user.firstName);
    cy.findByLabelText(/last name/i).type(user.lastName);
    cy.findByLabelText(/email/i).type(user.email);
    cy.findByLabelText('Password').type(user.password);
    cy.findByRole('button', {name: /sign up/i})
      .should('be.enabled')
      .click();

    cy.wait('@signUpCoordinator')
      .its('request.body')
      .should('deep.equal', user);

    cy.url().should('include', `signup/success?email=${user.email}`);
  });

  it.only('user can sign up as a host', () => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: 'host',
      password: 'Test123!',
    };

    cy.visit('/signup');

    cy.findByRole('button', {name: /select account/i}).should('be.disabled');

    cy.findByRole('button', {name: /host/i}).click();

    cy.findByRole('button', {name: /join as host/i})
      .should('be.enabled')
      .click();

    cy.url().should('include', '/signup');

    cy.findByRole('button', {name: /sign up/i}).should('be.disabled');

    cy.findByLabelText(/first name/i).type(user.firstName);
    cy.findByLabelText(/last name/i).type(user.lastName);
    cy.findByLabelText(/email/i).type(user.email);
    cy.findByLabelText('Password').type(user.password);
    cy.findByRole('button', {name: /sign up/i})
      .should('be.enabled')
      .click();

    cy.wait('@signUp').its('request.body').should('deep.equal', user);

    cy.url().should('include', `signup/success?email=${user.email}`);
  });
});
