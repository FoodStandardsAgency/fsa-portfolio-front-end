// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
const portfolios = require("./portfolios");
const project = require("./project");
const apiBaseUrl = `${Cypress.env("BACKEND_PROTOCOL")}://${Cypress.env("BACKEND_HOST")}/${Cypress.env("BACKEND_API_BASE")}`;

before(function() {
    // When running locally changing the test also restarts the instance of the web app!
    // This gives it time to start up again so don't get connection refused.
    cy.wait(2000);

    // Use the base Url in our env file
    const baseUrl = Cypress.env('baseUrl');
    Cypress.config("baseUrl", baseUrl);

    cy.loginAdmin();
    project.deleteAllProjects(portfolios.TEST_PORTFOLIO);

    cy.getAccessToken().then(function () {
        var token = this.access_token;
        cy.log(token);
        cy.request(
            {
                url: `${apiBaseUrl}/Portfolios/cleanreservations`,
                auth: { bearer: token },
                headers: {
                    'TestAPIKey': Cypress.env("TEST_API_KEY")
                }
            });
    });
});


beforeEach(() => {
    
});


