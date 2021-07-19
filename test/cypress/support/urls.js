const base = Cypress.env('baseUrl');

const appRelative = {
    LOGIN_PAGE: "/login",
    LOGOUT_PAGE: "/log-out",
    HOME_PAGE: "/",
    PortfolioHome: (portfolio) => `/${portfolio}`,
    PortfolioAdmin: (portfolio) => `/${portfolio}/portfolio-team`,
    PortfolioConfigure: (portfolio) => `/${portfolio}/configure`,
    ProjectEdit: (portfolio, projectId) => `/${portfolio}/edit/${projectId}`,
    ProjectView: (portfolio, projectId) => `/${portfolio}/Projects/${projectId}`,
    ProjectDelete: (portfolio, projectId) => `/${portfolio}/delete/${projectId}`,
    ProjectDeleteConfirmed: (portfolio) => `/${portfolio}/delete_project_process`
};

const fullUrl = {
    BASE_URL: base,
    LOGIN_PAGE: `${base}${appRelative.LOGIN_PAGE}`,
    LOGOUT_PAGE: `${base}${appRelative.LOGOUT_PAGE}`,
    HOME_PAGE: `${base}${appRelative.HOME_PAGE}`,
    PortfolioHome: (portfolio) => `${base}${appRelative.PortfolioHome(portfolio)}`,
    PortfolioAdmin: (portfolio) => `${base}${appRelative.PortfolioAdmin(portfolio)}`,
    PortfolioConfigure: (portfolio) => `${base}${appRelative.PortfolioConfigure(portfolio)}`,
    ProjectView: (portfolio, projectid) => `${base}${appRelative.ProjectView(portfolio, projectid)}`,
    ProjectEdit: (portfolio, projectid) => `${base}${appRelative.ProjectEdit(portfolio, projectid)}`,
    ProjectDelete: (portfolio, projectid) => `${base}${appRelative.ProjectDelete(portfolio, projectid)}`,
    ProjectDeleteConfirmed: (portfolio) => `${base}${appRelative.ProjectDeleteConfirmed(portfolio)}`
};


module.exports = { appRelative, fullUrl };
