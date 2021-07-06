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
        });
        describe("I can configure fields.", function () {

            it("Can include all fields from the project edit page.", function () {
                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field, true);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                    }
                });
            });

            it("Can exlude all fields, except include locked fields, from the project edit page.", function () {
                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field, false);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        if (label.included && label.included_lock)
                            cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                        else
                            cy.get(`[data-cy=${label.field}_label_vw]`).should('not.exist');
                    }
                });
            });

            it("Admin only fields are visible to admins and hidden to editors in the the project edit page.", function () {
                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field, true);
                    config.setFieldAdminOnly(label.field, true);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check fields visible to admin in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                        cy.get(`[data-cy=${label.field}]`).should('exist');
                    }
                });

                // Check fields hidden to editor in project edit view
                cy.loginEditor();
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, portfolios.TEST_PROJECT));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (!config.fieldsWithNoProjectEditLabel.includes(label.field)) {
                        if (label.editorcanview || (label.adminonly_lock && ! label.admin)) {
                            cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                            cy.get(`[data-cy=${label.field}]`).should('exist');

                        } else {
                            cy.get(`[data-cy=${label.field}_label_vw]`).should('not.exist');
                            cy.get(`[data-cy=${label.field}]`).should('not.exist');
                        }
                    }
                });

            });
        });
    });

