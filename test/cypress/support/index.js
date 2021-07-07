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
var urls = require("./urls");
var portfolios = require("./portfolios");

before(function() {
    // When running locally changing the test also restarts the instance of the web app!
    // This gives it time to start up again so don't get connection refused.
    cy.wait(2000);

    // Use the base Url in our env file
    const baseUrl = Cypress.env('baseUrl');
    Cypress.config("baseUrl", baseUrl);
});


beforeEach(() => {
    
});


