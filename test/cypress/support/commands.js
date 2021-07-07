var urls = require("./urls");
var portfolios = require("./portfolios");
var users = require("./users");


// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const apiBaseUrl = `${Cypress.env("BACKEND_PROTOCOL")}://${Cypress.env("BACKEND_HOST")}/${Cypress.env("BACKEND_API_BASE")}`;

Cypress.Commands.add('loginAdmin', () => {
    cy.login(users.TEST_ADMIN_USER.username, users.TEST_ADMIN_USER.password);
});

Cypress.Commands.add('loginEditor', () => {
    cy.login(users.TEST_EDITOR_USER.username, users.TEST_EDITOR_USER.password);
});

Cypress.Commands.add('loginReader', () => {
    cy.login(users.TEST_READER_USER.username, users.TEST_READER_USER.password);
});

Cypress.Commands.add('login', (user, password) => {
    cy.visit(urls.appRelative.LOGOUT_PAGE);
    cy.visit(urls.appRelative.LOGIN_PAGE);
    cy.get("a[data-cy=credentials-link]").click();
    cy.get("input[data-cy=user]").type(user);
    cy.get("input[data-cy=password]").type(password);
    cy.get("button[data-cy=credentials-submit]").click().url().should("equal", urls.fullUrl.HOME_PAGE);
});

Cypress.Commands.add('getPortfolioConfig', (portfolio) => {
    cy.request(
        {
            url: `${apiBaseUrl}/PortfolioConfiguration?portfolio=${portfolio}`,
            headers: { 'TestAPIKey': Cypress.env("TEST_API_KEY") }
        })
        .then((response) => response.body).as('portfolio_config')
        .then((config) => config.labels).as('portfolio_labels');
    cy.wrap(portfolio).as('portfolio');
});

Cypress.Commands.add('getLabelConfig', function (field) {
    var fieldData = {
        field: field,
        type: null,
        title: null,
        label: null,
        included: null,
        inputvalue: null,
        displaylabel: null
    };
    cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
    cy.get(`[data-cy=${field}_fieldtitle]`).invoke('text').then(function (title) {
        fieldData.title = title;
        cy.get(`[data-cy=${field}_label]`).invoke('val').then(function (label) {
            fieldData.label = label;
            fieldData.displaylabel = label && label.trim() ? label : title;
            cy.get(`[data-cy=${field}_included]`).invoke('val').then(function (included) {
                fieldData.included = (included === "true");
                cy.get(`[data-cy=${field}_inputvalue]`).invoke('val').then(function (inputvalue) {
                    fieldData.inputvalue = inputvalue;
                    cy.wrap(fieldData).as('fielddata');
                });
            });
        });
    });
});




