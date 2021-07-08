/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");
var config = require("../support/config_helpers");
const _ = require("lodash");

context(
    "I can configure portfolios.",
    function () {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(function () {
            cy.loginAdmin();
        });
        describe("I can configure field labels.", function () {

            it("Maximum label size of 50 characters is enforced.", function () {

                // Configure label
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                var label = this.portfolio_labels[0];
                config.setLabelText(label.field, "01234567890123456789012345678901234567890123456789");
                cy.get(`[data-cy=submit]`).click();
                cy.get('h1.project-title').contains("Configuration");

                // Put 51 characters in
                config.setLabelText(label.field, "_01234567890123456789012345678901234567890123456789");
                cy.get(`[data-cy=submit]`).click();
                cy.get(`[data-cy=error]`).contains(`Problem with configuration for field ${label.fieldtitle}: The field Label must be a string with a maximum length of 50`);

            });

            it("Field labels are displayed in the project edit page.", function () {

                var fields = _.filter(this.portfolio_labels, f => !config.fieldsWithNoProjectEditLabel.includes(f.field));

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(fields).each(function (label) {
                    var newLabel = `${label.field} test label`;
                    config.setFieldIncluded(label.field);
                    config.setLabelText(label.field, newLabel);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(fields).each(function (label) {
                    var newLabel = `${label.field} test label`;
                    cy.get(`[data-cy=${label.field}_label_vw]`).contains(newLabel);
                });
            });

            it("When there is no field label, the the field title is displayed in the project edit page.", function () {

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field);
                    config.setLabelText(label.field, null);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        cy.get(`[data-cy=${label.field}_label_vw]`).contains(label.fieldtitle);
                    }
                });
            });
        });
    });


