/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");

context(
    "I can browse portfolios.",
    () => {
        beforeEach(() => {
            cy.visit(urls.LOGIN_PAGE);
            cy.get("a[data-cy=credentials-link]").click();
            cy.get("input[data-cy=user]").type(users.TEST_USER);
            cy.get("input[data-cy=password]").type(users.TEST_USER_PASSWORD);
            cy.get("button[data-cy=credentials-submit]").click().url().should("equal", urls.HOME_PAGE);
        });
        describe("I can browse portfolio summaries.", () => {
            it('The portfolio summary loads.', () => {
                cy.get("[data-cy=portfolio-link]").each(($el, index, $list) => {
                    cy.visit(`${urls.BASE_URL}${$el.attr('href')}`);
                    cy.get('[data-cy=summary-nav-link]')
                        .each(($elSL, indexSL, $listSL) => {
                            cy.visit(`${urls.BASE_URL}${$elSL.attr('href')}`);
                    });
                    //cy.visit($el.attr("href"));
                });
            });
        });
    });
