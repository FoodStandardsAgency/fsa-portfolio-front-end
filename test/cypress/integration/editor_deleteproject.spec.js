/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");
var project = require("../support/project");

const _ = require("lodash");

context(
    "Editor tasks on projects.",
    () => {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(() => {
            cy.loginAdmin();
        });
        describe("I can delete a project.", () => {

            it('Delete a project with dependencies on another project.', function() {

                if (this.required_fields.length == 0) throw new Error('This test requires at least one field to have "required=true": the current portfolio has none.');

                project.addProject(this.portfolio, this.required_fields);
                cy.get('@project_id').then((projectId) => {
                    project.deleteProject(this.portfolio, projectId);
                });

            });

        });
    });
