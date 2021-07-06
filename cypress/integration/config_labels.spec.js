/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");
var config = require("../support/config_helpers");

context(
    "I can configure portfolios.",
    function () {
        beforeEach(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
            cy.loginAdmin();
        });
        describe("I can configure field labels.", function () {

            it("Field labels are displayed in the project edit page.", function () {

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    var newLabel = `${label.field} test label`;
                    config.setFieldIncluded(label.field);
                    config.setLabelText(label.field, newLabel);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        var newLabel = `${label.field} test label`;
                        cy.get(`[data-cy=${label.field}_label_vw]`).contains(newLabel);
                    }
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


