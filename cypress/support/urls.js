const base = Cypress.env('baseUrl');

const url = {
    BASE_URL: base,
    LOGIN_PAGE: `login`,
    LOGOUT_PAGE: `log-out`,
    HOME_PAGE: `/`,
    PortfolioHome: (portfolio) => `${HOME_PAGE}/${portfolio}`
}

module.exports = url;
