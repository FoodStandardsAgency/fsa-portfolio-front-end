/// <reference types="cypress" />
const urls = require("../support/urls");
const portfolios = require("../support/portfolios");
const project = require("../support/project");


context(
    "I can configure portfolios.",
    function () {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(function () {
            cy.loginAdmin();
            project.addProject(this.portfolio, this.required_fields, { tag: "project to test field editing" });
        });
        describe("I can configure and edit fields.", () => {
            it('I can set a field to included and edit its value.', function () {
                cy.wrap(this.portfolio_labels).each(function (label) {
                    cy.getLabelConfig(label.field).then(function () {
                        cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id)).then(function () {
                            var fieldName = this.fielddata.field;
                            var fieldDisplayLabel = this.fielddata.displaylabel;
                            var fieldIncluded = this.fielddata.included;

                            var inputType = label.inputtype;


                            if (fieldIncluded) {
                                switch (inputType) {
                                    case "auto":
                                        break;
                                    case "projectdate":
                                        cy.get(`input[data-cy=${fieldName}_day]`);
                                        cy.get(`input[data-cy=${fieldName}_month]`);
                                        cy.get(`input[data-cy=${fieldName}_year]`);
                                        break;
                                    case "milestones":
                                        cy.get(`div[data-cy=${fieldName}]`);
                                        // Need to get the count of milestones before look for inputs
                                        //cy.get(`input[data-cy=${fieldName}_order]`);
                                        //cy.get(`input[data-cy=${fieldName}_name]`);
                                        //cy.get(`input[data-cy=${fieldName}_day]`);
                                        //cy.get(`input[data-cy=${fieldName}_month]`);
                                        //cy.get(`input[data-cy=${fieldName}_year]`);
                                        break;
                                    case "linkeditemlist":
                                        cy.get(`div[data-cy=${fieldName}]`);
                                        // Need to get the count of docs before look for inputs
                                        break;
                                    case "namedlink":
                                        cy.get(`input[data-cy=${fieldName}_name]`);
                                        cy.get(`input[data-cy=${fieldName}_link]`);
                                        break;
                                    case "optionlist":
                                    case "multioptionlist":
                                    case "predefinedmultilist":
                                    case 'predefinedlist':
                                    case 'ragchoice':
                                    case 'phasechoice':
                                    case "ajaxmultisearch":
                                    case "adusersearch":
                                    case "adusermultisearch":
                                        cy.get(`select[data-cy=${fieldName}]`);
                                        break;
                                    case "projectupdatetext":
                                    case "smallfreetextarea":
                                    case "mediumfreetextarea":
                                    case "largefreetextarea":
                                        cy.get(`textarea[data-cy=${fieldName}]`);
                                        break;
                                    case "freetext":
                                        cy.get(`input[data-cy=${fieldName}]`);
                                        break;
                                    default:
                                        cy.get(`input[data-cy=${fieldName}]`);
                                        break;
                                }
                            }
                        });
                    });
                });
            });

        });
    });
