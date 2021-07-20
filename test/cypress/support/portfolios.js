
const portfolios = {
    TEST_PORTFOLIO: Cypress.env('portfolio'),
    ALL: Cypress.env('portfolios')
}

module.exports = portfolios;
