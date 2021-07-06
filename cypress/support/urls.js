const base = Cypress.env('baseUrl');

const appRelative = {
    LOGIN_PAGE: "/login",
    LOGOUT_PAGE: "/log-out",
    HOME_PAGE: "/",
    PortfolioHome: (portfolio) => `/${portfolio}`,
    PortfolioConfigure: (portfolio) => `/${portfolio}/configure`,
    ProjectEdit: (portfolio, projectId) => `/${portfolio}/edit/${projectId}`,
    ProjectView: (portfolio, projectId) => `/${portfolio}/projects/${projectId}`
};

const fullUrl = {
    BASE_URL: base,
    LOGIN_PAGE: `${base}${appRelative.LOGIN_PAGE}`,
    LOGOUT_PAGE: `${base}${appRelative.LOGOUT_PAGE}`,
    HOME_PAGE: `${base}${appRelative.HOME_PAGE}`,
    PortfolioHome: (portfolio) => `${base}${appRelative.PortfolioHome(portfolio)}`,
    PortfolioConfigure: (portfolio) => `${base}${appRelative.PortfolioConfigure(portfolio)}`
};


module.exports = { appRelative, fullUrl };
