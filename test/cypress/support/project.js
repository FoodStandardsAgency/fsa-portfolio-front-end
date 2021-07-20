var urls = require("../support/urls");

const apiBaseUrl = `${Cypress.env("BACKEND_PROTOCOL")}://${Cypress.env("BACKEND_HOST")}/${Cypress.env("BACKEND_API_BASE")}`;

module.exports = {
    enterFieldValue: enterFieldValue, 
    addProject: addProject,
    deleteProject: deleteProject,
    deleteAllProjects: deleteAllProjects

}

function addProject(portfolio, requiredFields, opts) {
    // Open add project page
    cy.visit(urls.appRelative.PortfolioAdmin(portfolio));
    cy.get('[data-cy=add-project-link]').click();

    // Store the project id
    cy.get('[data-cy=project_id]')
        .invoke('val').as('project_id')
        .then((val) => cy.log(`New project Id "${val}"`));

    // Each required field should have an invisible validation error
    cy.wrap(requiredFields).each(function (label) {
        cy.get(`[data-cy=${label.field}_validation_error]`).should('not.be.visible');
    });

    // Enter data
    cy.wrap(requiredFields).each(function (label) {
        enterFieldValue(label, null, opts?.tag);
    });

    // Process options
    if (opts?.dependencies) {
        cy.wrap(opts.dependencies).each(function (dep) {
            cy.get('[data-cy=dependencies]').next().click().type(dep);
            cy.get('[data-cy=dependencies]').next().next().contains(dep).click();
        });
    }
    if (opts?.related) {
        cy.wrap(opts.related).each(function (rel) {
            cy.get('[data-cy=rels]').next().click().type(rel);
            cy.get('[data-cy=rels]').next().next().contains(rel).click();
        });
    }

    // Try submit
    return cy.get('[data-cy=submit').click().then(function () {
        var url = urls.fullUrl.ProjectView(this.portfolio, this.project_id);
        cy.log(url);
        cy.url().should('equal', url);

        // Validate project view page
        cy.get('[data-cy=project_id]').contains(`Project ID: ${this.project_id}`);
    });
};

function enterFieldValue(label, prefix, tag) {
    prefix = prefix ?? "SIT PREFIX: ";
    var text = tag ? `${prefix}${label.fieldtitle} [${tag}]` : `${prefix}${label.fieldtitle}`;
    switch (label.inputtype) {
        case "auto":
            break;
        case "projectdate":
            cy.get(`input[data-cy=${fieldName}_day]`);
            cy.get(`input[data-cy=${fieldName}_month]`);
            cy.get(`input[data-cy=${fieldName}_year]`);
            break;
        case "milestones":
            cy.get(`div[data-cy=${fieldName}]`);
            // Need to get the count of milestones before look for inputs
            //cy.get(`input[data-cy=${fieldName}_order]`);
            //cy.get(`input[data-cy=${fieldName}_name]`);
            //cy.get(`input[data-cy=${fieldName}_day]`);
            //cy.get(`input[data-cy=${fieldName}_month]`);
            //cy.get(`input[data-cy=${fieldName}_year]`);
            break;
        case "linkeditemlist":
            cy.get(`div[data-cy=${fieldName}]`);
            // Need to get the count of docs before look for inputs
            break;
        case "namedlink":
            cy.get(`input[data-cy=${fieldName}_name]`);
            cy.get(`input[data-cy=${fieldName}_link]`);
            break;
        case "optionlist":
        case "multioptionlist":
        case "predefinedmultilist":
        case 'predefinedlist':
        case 'ragchoice':
        case 'phasechoice':
        case "ajaxmultisearch":
        case "adusersearch":
        case "adusermultisearch":
            cy.get(`select[data-cy=${fieldName}]`);
            break;
        case "projectupdatetext":
        case "smallfreetextarea":
        case "mediumfreetextarea":
        case "largefreetextarea":
        case "freetext":
            cy.get(`[data-cy=${label.field}]`).type(text);
            break;
        default:
            cy.get(`input[data-cy=${fieldName}]`);
            break;
    }
};

function deleteProject(portfolio, projectId) {
    cy.visit(urls.appRelative.ProjectView(portfolio, projectId));
    cy.get('[data-cy=delete-project-button]').click().url().should("equal", urls.fullUrl.ProjectDelete(portfolio, projectId));
    return cy.get('[data-cy=submit]').click().url().should("equal", urls.fullUrl.ProjectDeleteConfirmed(portfolio));
}

function deleteAllProjects(portfolio) {
    cy.request({
        url: `${apiBaseUrl}/Projects?portfolio=${portfolio}`,
        headers: { 'TestAPIKey': Cypress.env("TEST_API_KEY") }
    }).then((response) => {
        var projects = response.body.Projects;
        cy.wrap(projects).each(p => {
            deleteProject(portfolio, p.project_id);
        });
    });
}
