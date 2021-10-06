/// <reference types="cypress" />
const urls = require("../support/urls");
const portfolios = require("../support/portfolios");
const config = require("../support/config_helpers");
const project = require("../support/project");

context(
    "I can configure portfolios.",
    function () {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(function(){
            cy.loginAdmin();
            project.addProject(this.portfolio, this.required_fields, { tag: "project to test option lists" });
        });

        describe("I can configure field options.", function () {
            it("Options for included optionlist fields appear in project edit drop down lists.", function () {
                // Configure fields
                cy.visit(urls.appRelative.PortfolioConfigure(this.portfolio));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (label.inputtype == "optionlist") {
                        config.setFieldIncluded(label.field, true);
                        var options = `${label.field}1, ${label.field}2, ${label.field}3`;
                        config.setFieldInputValue(label.field, options);
                    }
                });
                cy.get(`[data-cy=submit]`).click();

                // Check options in project edit view
                cy.visit(urls.appRelative.ProjectEdit(this.portfolio, this.project_id));
                cy.wrap(this.portfolio_labels).each(function (label) {
                    if (label.inputtype == "optionlist") {
                        var expected = [`${label.field}1`, `${label.field}2`, `${label.field}3`];
                        cy.get(`select[data-cy=${label.field}] option`).then(options => {
                            const actual = [...options].map(o => o.text);
                            expected.forEach((x) => expect(actual).to.deep.include(x));
                        });
                    }
                });
            });
        });
    });

