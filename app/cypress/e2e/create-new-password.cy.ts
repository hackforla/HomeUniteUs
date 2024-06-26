import {faker} from '@faker-js/faker';

describe('Forgot Password', () => {
  beforeEach(() => {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    const cookieExpiration = oneHourFromNow.toUTCString();

    cy.intercept('POST', '/api/auth/new_password', {
      statusCode: 200,
      headers: {
        'Set-Cookie': `session=fake_session_value; expires=${cookieExpiration}; path=/`,
      },
      body: {
        token: 'fake.jwt.token',
        user: {
          email: 'test@gmail.com',
        },
      },
    }).as('resetPassword');

    cy.intercept('GET', '/api/auth/session', req => {
      req.reply({
        statusCode: 200,
      });
    }).as('session');

    cy.intercept('GET', '/api/auth/refresh', req => {
      req.reply({
        statusCode: 200,
      });
    }).as('refresh');

    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        token: 'fake.jwt.token',
        user: {
          email: 'test@gmail.com',
        },
      },
    }).as('user');
  });

  it('should let the user reset their password', () => {
    const userId = faker.string.uuid();
    const sessionId = faker.string.uuid();
    const password = 'Test1234!';

    cy.visit(`/create-password?userId=${userId}&sessionId=${sessionId}`);

    cy.findByLabelText('Password').type(password);
    cy.findByLabelText('Confirm Password').type(password);

    cy.findByRole('button', {name: /submit/i}).click();

    cy.wait('@resetPassword').then(({request}) => {
      expect(request.body).to.deep.equal({
        userId,
        sessionId,
        password,
        confirmPassword: password,
      });
    });

    cy.url().should('include', '/guest');
  });

  it('should display error message from params', () => {
    const errorMessage = 'Incorrect username or password.';
    cy.visit(`/create-password?error=${errorMessage}`);

    cy.findByRole('alert').should('have.text', errorMessage);
  });
});
