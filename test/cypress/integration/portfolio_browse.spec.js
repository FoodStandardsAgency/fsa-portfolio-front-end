/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");

context(
    "An admin can browse all portfolios.",
    () => {
        before(function () {
            cy.getPortfolioConfig(portfolios.TEST_PORTFOLIO);
        });
        beforeEach(function () {
            cy.loginAdmin();
        });
        describe("I can view all portfolio links.", () => {

            it('I can view all portfolio summaries.', () => {

                // Visit each portfolio
                cy.get("[data-cy=portfolio-link]").each(($el, index, $list) => {
                    cy.visit(`${$el.attr('href')}`);

                    // Visit all summary links
                    cy.get('[data-cy=summary-nav-link]')
                        .each(($elSL, indexSL, $listSL) => {
                            cy.visit(`${$elSL.attr('href')}`);
                    });
                });
            });

            it('I can view portfolio navigation links.', function() {

                cy.visit(urls.appRelative.PortfolioHome(this.portfolio));
                cy.get("[data-cy=index-nav-link]").click().url().should("equal", urls.fullUrl.HOME_PAGE);

                cy.visit(urls.appRelative.PortfolioHome(this.portfolio));
                cy.get("[data-cy=admin-nav-link]").click().url().should("equal", urls.fullUrl.PortfolioAdmin(this.portfolio));
            });
        });
    });
