/// <reference types="cypress" />
const urls = require("../support/urls");
const users = require("../support/users");
const portfolios = require("../support/portfolios");
const config = require("../support/config_helpers");
const project = require("../support/project");
const _ = require("lodash");

context(
    "I can configure portfolios.",
    function () {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO).then(function () {
                // Need a project to view
                cy.loginAdmin();
                project.addProject(this.portfolio, this.required_fields, { tag: "project used to test field configuration" });
            });
        });
        describe("I can configure fields.", function () {

            it("Can include all fields in the project edit page.", function () {
                var fields = _.filter(this.portfolio_labels, f => !config.fieldsWithNoProjectEditLabel.includes(f.field));

                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field, true);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id));
                cy.wrap(fields).each(function (label) {
                    cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                });
            });

            it("Can exclude all fields, except include locked fields, from the project edit page.", function () {
                var fields = _.filter(this.portfolio_labels, f => !config.fieldsWithNoProjectEditLabel.includes(f.field));

                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    config.setFieldIncluded(label.field, false);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check labels in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id));
                cy.wrap(fields).each(function (label) {
                    if (label.included && label.included_lock)
                        cy.get(`[data-cy=${label.field}_label_vw]`).should('exist');
                    else
                        cy.get(`[data-cy=${label.field}_label_vw]`).should('not.exist');
                });
            });

            it("Admin only fields are visible to admins and hidden to editors in the the project edit page.", function () {

                var fields = _.filter(this.portfolio_labels, f => !config.fieldsWithNoProjectEditLabel.includes(f.field));

                cy.loginAdmin();

                // Configure labels
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(fields).each(function (label) {
                    config.setFieldIncluded(label.field, true);
                    config.setFieldAdminOnly(label.field, true);
                });
                cy.get(`[data-cy=submit]`).click();

                // Check fields visible to admin in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id));
                cy.wrap(fields).each(function (label) {
                    config.checkProjectEditLabel(label, 'exist');
                });

                // Check fields hidden to editor in project edit view
                cy.loginEditor();
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id));
                cy.wrap(fields).each(function (label) {
                    if (label.editorcanview || (label.adminonly_lock && !label.admin)) {
                        config.checkProjectEditLabel(label, 'exist');
                    } else {
                        config.checkProjectEditLabel(label, 'not.exist');
                    }
                });

            });
        });
    });

