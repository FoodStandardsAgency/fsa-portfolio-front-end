module.exports = {

    fieldsWithNoProjectEditLabel: ["pgroup", "g6team"],

    setFieldIncluded: (field, included = true) => {
        // Include the field
        cy.get(`[data-cy=${field}_included]`).invoke('attr', 'type').then(t => {
            if (t == "checkbox") {
                if (included)
                    cy.get(`[data-cy=${field}_included]`).check();
                else
                    cy.get(`[data-cy=${field}_included]`).uncheck();
            }
        });
    },

    setFieldAdminOnly: (field, adminOnly = true) => {
        // Include the field
        cy.get(`[data-cy=${field}_adminOnly]`).invoke('attr', 'type').then(t => {
            if (t == "checkbox") {
                if (adminOnly)
                    cy.get(`[data-cy=${field}_adminOnly]`).check();
                else
                    cy.get(`[data-cy=${field}_adminOnly]`).uncheck();
            }
        });
    },

    setLabelText: (field, labelText) => {
        // Set the new value
        if (labelText)
            cy.get(`[data-cy=${field}_label]`).clear().type(labelText);
        else
            cy.get(`[data-cy=${field}_label]`).clear();
    },

    setFieldInputValue: (field, value) => {
        // Set the new value
        if (value)
            cy.get(`[data-cy=${field}_inputvalue]`).clear().type(value);
        else
            cy.get(`[data-cy=${field}_inputvalue]`).clear();
    },

    checkProjectEditLabel: (label, condition) => {
        cy.get(`[data-cy=${label.field}_label_vw]`).should(condition);
        switch (label.inputtype) {
            case "namedlink":
                cy.get(`[data-cy=${label.field}_name]`).should(condition);
                cy.get(`[data-cy=${label.field}_link]`).should(condition);
                break;
            default:
                cy.get(`[data-cy=${label.field}]`).should(condition);
                break;
        }

    }

};


