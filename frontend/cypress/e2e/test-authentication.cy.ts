const LOGIN_PAGES_URL_PATTERN = /\/(coordinator|host|guest)/;
const SIGNIN_PAGE_URL: string = Cypress.config().baseUrl + '/signin';
const HOME_PAGE_URL: string = Cypress.config().baseUrl + '/';
const PROTECTED_PATHS: string[] = ['/guest', '/host', '/coordinator'];

function loginUsingUI(password: string, email: string) {
  cy.findByRole('textbox', {name: /email/i}).type(email);
  cy.get('#password').type(password);
  cy.contains('button', 'Sign in').click();
}

function logoutUsingUI() {
  cy.get('button[aria-label="Open settings"]').click();
  cy.contains('p', 'Logout').should('be.visible').click();
}

describe('Authentication', () => {
  beforeEach(function () {
    this.email = Cypress.env('USE_MOCK')
      ? 'test@gmail.com'
      : Cypress.env('REAL_EMAIL');
    this.password = Cypress.env('USE_MOCK')
      ? 'Test123#'
      : Cypress.env('REAL_PASSWORD');
    expect(this.email).is.not.undefined;
    expect(this.password).is.not.undefined;

    const getIsSignedIn = () => {
      // You cannot use the cy.url() command within the cy.intercept() handler directly
      // because Cypress commands are asynchronous, and cy.intercept() expects a synchronous response.
      return LOGIN_PAGES_URL_PATTERN.test(window.location.pathname);
    };

    const isUserPassCorrect = (user: string, pass: string) => {
      return user == this.email && pass == this.password;
    };

    if (Cypress.env('USE_MOCK')) {
      const oneHourFromNow = new Date();
      oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
      const cookieExpiration = oneHourFromNow.toUTCString();

      cy.intercept('POST', '/api/auth/signin', req => {
        const {email, password} = req.body;
        req.reply({
          statusCode: isUserPassCorrect(email, password) ? 200 : 401,
          headers: {
            'Set-Cookie': `session=fake_session_value; expires=${cookieExpiration}; path=/`,
          },
          body: isUserPassCorrect(email, password)
            ? {
                token: 'fake.jwt.token',
                user: {
                  email: 'test@gmail.com',
                  firstName: 'Test',
                  lastName: 'User',
                  id: 2,
                  role: {
                    id: 2,
                    type: 'guest',
                  },
                },
              }
            : {
                error: 'Authentication failed',
              },
        });
      }).as('signin');
      cy.intercept('POST', '/api/auth/signout', {
        statusCode: 200,
        headers: {
          'Set-Cookie':
            'session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Path=/',
        },
      }).as('signout');
      cy.intercept('GET', '/api/auth/session', req => {
        req.reply({
          statusCode: getIsSignedIn() ? 200 : 401,
        });
      }).as('session');

      cy.intercept('GET', '/api/auth/refresh', req => {
        req.reply({
          statusCode: getIsSignedIn() ? 200 : 401,
        });
      }).as('refresh');
      cy.intercept('GET', '/api/users/current', {
        statusCode: 200,
        body: {
          token: 'fake.jwt.token',
          user: {
            email: 'test@gmail.com',
          },
        },
      }).as('user');
    } else {
      cy.intercept('POST', '/api/auth/signin').as('signin');
      cy.intercept('POST', '/api/auth/signout').as('signout');
      cy.intercept('GET', '/api/auth/session').as('session');
      cy.intercept('GET', '/api/auth/refresh').as('refresh');
      cy.intercept('GET', '/api/users/current').as('user');
    }
  });

  it('should log the user in, show login page', function () {
    cy.visit('/signin');
    loginUsingUI(this.password, this.email);

    cy.wait('@signin').then(intercept => {
      const body = intercept.response?.body;

      expect(body).to.have.property('user');
      expect(body.user).to.have.property('email', this.email);
      expect(body).to.have.property('token');
      expect(body.token).to.be.a('string').and.not.to.be.empty;
    });

    cy.url().should('match', LOGIN_PAGES_URL_PATTERN);
  });

  it('should signin, signout then prevent accessing authenticated pages', function () {
    cy.visit('/signin');
    loginUsingUI(this.password, this.email);
    cy.wait('@signin').its('response.statusCode').should('be.within', 200, 299);
    logoutUsingUI();
    cy.url().should('eq', HOME_PAGE_URL);
    for (const path of PROTECTED_PATHS) {
      cy.visit(path);
      cy.url().should('eq', SIGNIN_PAGE_URL);
    }
  });

  it('should block signin when incorrect email/pass used', function () {
    cy.visit('/signin');

    loginUsingUI('1_pp#FXo;h$i~', 'inbox827@example.com');
    cy.wait('@signin').its('response.statusCode').should('be.within', 400, 499);
    cy.url().should('eq', SIGNIN_PAGE_URL);

    // Check protected paths still protected after our failed login attempt
    for (const path of PROTECTED_PATHS) {
      cy.visit(path);
      cy.url().should('eq', SIGNIN_PAGE_URL);
    }
  });

  it('should prevent navigation to authenticated pages before signin', function () {
    for (const path of PROTECTED_PATHS) {
      cy.visit(path);
      cy.url().should('eq', SIGNIN_PAGE_URL);
    }
  });

  it('should stay logged in without redirecting', function () {
    cy.visit('/signin');
    loginUsingUI(this.password, this.email);

    cy.wait('@signin').its('response.statusCode').should('be.within', 200, 299);

    let signinURL: string;
    cy.url().should(url => {
      expect(url).to.match(LOGIN_PAGES_URL_PATTERN);
      signinURL = url;
    });

    cy.url().then(url => {
      expect(url).to.equal(
        signinURL,
        'Signin page redirected shortly after signin!',
      );
    });
  });

  it('should receive a session cookie at signin and send cookie with requests', function () {
    if (Cypress.env('USE_MOCK')) {
      // Mocking the exact cookie update behavior is difficult
      // Leave this test for real credentials
      this.skip();
    }

    cy.getCookie('session').should('not.exist');

    cy.visit('/signin');
    // Expect 400 since we don't have a session cookie
    cy.wait('@session').its('response.statusCode').should('eq', 400);

    cy.findByRole('textbox', {name: /email/i}).type(this.email);
    cy.get('#password').type(this.password);
    cy.contains('button', 'Sign in').click();

    cy.wait('@signin').then(intercept => {
      const body = intercept.response?.body;
      const setCookieHeader = intercept.response?.headers['set-cookie'];
      expect(body).to.have.property('user');
      expect(body.user).to.have.property('email', this.email);
      expect(setCookieHeader).to.exist;
      expect(setCookieHeader).to.be.an('array').with.length(1);
      if (setCookieHeader) {
        expect(setCookieHeader[0]).to.include('session=');
      } else {
        throw new Error('set-cookie header is not set');
      }
    });

    cy.url().should('match', LOGIN_PAGES_URL_PATTERN);
  });

  it('should have access to user data after signin', function () {
    cy.visit('/signin');
    loginUsingUI(this.password, this.email);

    cy.wait('@signin').then(intercept => {
      expect(intercept.response?.statusCode).eq(200);
      const body = intercept.response?.body;
      expect(body).to.have.property('user');
      expect(body.user).to.have.property('email');
    });
  });

  it('should remained logged in after a page refresh', function () {
    if (Cypress.env('USE_MOCK')) {
      // Mocking the exact refresh and session endpoint behavior is difficult
      // Leave this test for real credentials
      this.skip();
    }

    cy.visit('/signin');
    loginUsingUI(this.password, this.email);
    cy.url().should('match', LOGIN_PAGES_URL_PATTERN);
    cy.reload();

    cy.url().should('match', LOGIN_PAGES_URL_PATTERN);
  });
});
