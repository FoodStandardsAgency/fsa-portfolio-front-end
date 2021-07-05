/// <reference types="cypress" />
var urls = require("../support/urls");
var users = require("../support/users");
var portfolios = require("../support/portfolios");

context(
    "I can log into the Portfolio Application.",
    () => {
        beforeEach(() => {
            cy.visit(urls.LOGIN_PAGE);
        });
        describe("Log in page loads.", () => {
            it('Log in options are displayed.', () => {
                cy.get("[data-cy=ad-auth-link]")
                    .should("have.text", "FSA employees - login with your Microsoft account");

                cy.get("[data-cy=credentials-link]")
                    .should("have.text", "Suppliers - login with credentials provided by FSA Digital");
            });
        });
        describe("SKIPPING! Log in with a Azure Active Directory.", () => {
            it("SKIPPING! I can log in with my Azure account", () => {
                // Not currently possible due to Cypress enforcing same-origin policy
            });
        });
        describe("Log in with a user name and password.", () => {
            it("I can log in with credentials", () => {
                cy.get("[data-cy=credentials-link]").click();
                cy.get("input[data-cy=user]").should("have.length", 1).type(users.TEST_USER);
                cy.get("input[data-cy=password]").should("have.length", 1).type(users.TEST_USER_PASSWORD);
                cy.get("[data-cy=credentials-submit]").should("have.length", 1).click().url().should("equal", `${urls.BASE_URL}${urls.HOME_PAGE}`);
                cy.get(".landing_link").should("have.length", portfolios.ALL.length);
            });
        });
    });
