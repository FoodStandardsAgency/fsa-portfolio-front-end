/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");
const _ = require("lodash");

context(
    "Admin tasks on projects.",
    () => {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(() => {
            cy.loginAdmin();
        });
        describe("I can add a new project.", () => {

            it('Add a new project with no fields set results in validation error.', function() {

                var requiredFields = _.filter(this.portfolio_labels, l => l.required);
                if (requiredFields.length == 0) throw new Error('This test requires at least one field to have "required=true": the current portfolio has none.');

                // Open add project page
                cy.visit(urls.appRelative.PortfolioAdmin(this.portfolio));
                cy.get('[data-cy=add-project-link]').click();

                // Store the project id
                cy.get('[data-cy=project_id]')
                    .invoke('val').as('project_id')
                    .then((val) => cy.log(`New project Id "${val}"`));

                // Each required field should have an invisible validation error
                cy.wrap(requiredFields).each(function (label) {
                    if (label.required) {
                        cy.get(`[data-cy=${label.field}_validation_error]`).should('not.be.visible');
                    }
                });

                // Try submit
                cy.get('[data-cy=submit').click();

                // Each required field should have an invisible validation error
                cy.wrap(requiredFields).each(function (label) {
                    if (label.required) {
                        cy.get(`[data-cy=${label.field}_validation_error]`).should('be.visible');
                    }
                });


            });

            it('Add a new project with required fields set.', function () {

                var requiredFields = _.filter(this.portfolio_labels, l => l.required);
                if (requiredFields.length == 0) throw new Error('This test requires at least one field to have "required=true": the current portfolio has none.');

                // Open add project page
                cy.visit(urls.appRelative.PortfolioAdmin(this.portfolio));
                cy.get('[data-cy=add-project-link]').click();

                // Store the project id
                cy.get('[data-cy=project_id]')
                    .invoke('val').as('project_id')
                    .then((val) => cy.log(`New project Id "${val}"`));

                // Each required field should have an invisible validation error
                cy.wrap(requiredFields).each(function (label) {
                    cy.get(`[data-cy=${label.field}_validation_error]`).should('not.be.visible');
                });

                // Enter data
                cy.wrap(requiredFields).each(function (label) {
                    cy.get(`[data-cy=${label.field}]`).type(label.fieldtitle);
                });

                // Try submit
                cy.get('[data-cy=submit').click().then(function () {
                    var url = urls.fullUrl.ProjectView(this.portfolio, this.project_id);
                    cy.log(url);
                    cy.url().should('equal', url);

                    // Validate project view page
                    cy.get('[data-cy=project_id]').contains(`Project ID: ${this.project_id}`);
                });


            });

        });
    });
