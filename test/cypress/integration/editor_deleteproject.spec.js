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

            it('Delete a project with a dependency and a related project.', function() {
                project.addProject(this.portfolio, this.required_fields, { tag: "editor_deleteproject::it()" }).then(function () { 
                    cy.get('@project_id').then(function(project1Id) {
                        project.addProject(this.portfolio, this.required_fields, { tag: "editor_deleteproject::it()" }).then(function () {
                            cy.get('@project_id').then(function (project2Id) {
                                project.addProject(this.portfolio, this.required_fields, { dependencies: [project1Id], related: [project2Id], tag: "editor_deleteproject::it()" }).then(function () {
                                    cy.get('@project_id').then(function (project3Id) {
                                        // Project 3 has 1 as a dependency and 2 as related
                                        project.deleteProject(this.portfolio, project3Id);
                                    });
                                });
                            });
                        });
                    });
                });
            });

            it('Delete a project dependency.', function () {
                project.addProject(this.portfolio, this.required_fields, { tag: "editor_deleteproject::it()" }).then(function () {
                    cy.get('@project_id').then(function (project1Id) {
                        project.addProject(this.portfolio, this.required_fields, { dependencies: [project1Id], tag: "editor_deleteproject::it()"  }).then(function () {
                            cy.get('@project_id').then(function (project2Id) {
                                // Project 2 has 1 as a dependency
                                project.deleteProject(this.portfolio, project1Id);
                            });
                        });
                    });
                });
            });

            it('Delete a project relation.', function () {
                project.addProject(this.portfolio, this.required_fields, { tag: "editor_deleteproject::it()" }).then(function () {
                    cy.get('@project_id').then(function (project1Id) {
                        project.addProject(this.portfolio, this.required_fields, { related: [project1Id], tag: "editor_deleteproject::it()" }).then(function () {
                            cy.get('@project_id').then(function (project2Id) {
                                // Project 2 has 1 as a relation
                                project.deleteProject(this.portfolio, project1Id);
                            });
                        });
                    });
                });
            });


        });
    });
