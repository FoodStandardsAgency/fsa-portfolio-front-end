
const portfolios = {
    TEST_PORTFOLIO: Cypress.env('portfolio'),
    ALL: Cypress.env('portfolios'),
    TEST_PROJECT: Cypress.env('projectid')
}

module.exports = portfolios;
