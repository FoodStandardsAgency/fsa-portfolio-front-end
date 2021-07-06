/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");

context(
    "I can browse portfolios.",
    () => {
        beforeEach(() => {
            cy.loginAdmin();
        });
        describe("I can browse portfolio summaries.", () => {
            it('The portfolio summary loads.', () => {

                // Visit each portfolio
                cy.get("[data-cy=portfolio-link]").each(($el, index, $list) => {
                    cy.visit(`${urls.BASE_URL}${$el.attr('href')}`);

                    // Visit all summary links
                    cy.get('[data-cy=summary-nav-link]')
                        .each(($elSL, indexSL, $listSL) => {
                            cy.visit(`${urls.BASE_URL}${$elSL.attr('href')}`);
                    });
                    //cy.visit($el.attr("href"));
                });
            });
        });
    });
