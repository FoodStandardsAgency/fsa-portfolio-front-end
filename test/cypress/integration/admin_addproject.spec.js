/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");
var project = require("../support/project");
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

                if (this.required_fields.length == 0) throw new Error('This test requires at least one field to have "required=true": the current portfolio has none.');

                // Open add project page
                cy.visit(urls.appRelative.PortfolioAdmin(this.portfolio));
                cy.get('[data-cy=add-project-link]').click();

                // Store the project id
                cy.get('[data-cy=project_id]')
                    .invoke('val').as('project_id')
                    .then((val) => cy.log(`New project Id "${val}"`));

                // Each required field should have an invisible validation error
                cy.wrap(this.required_fields).each(function (label) {
                    if (label.required) {
                        cy.get(`[data-cy=${label.field}_validation_error]`).should('not.be.visible');
                    }
                });

                // Try submit
                cy.get('[data-cy=submit').click();

                // Each required field should have an invisible validation error
                cy.wrap(this.required_fields).each(function (label) {
                    if (label.required) {
                        cy.get(`[data-cy=${label.field}_validation_error]`).should('be.visible');
                    }
                });


            });

            it.only('Add a new project with required fields set.', function () {

                if (this.required_fields.length == 0) throw new Error('This test requires at least one field to have "required=true": the current portfolio has none.');

                project.addProject(this.portfolio, this.required_fields);

            });

        });
    });
