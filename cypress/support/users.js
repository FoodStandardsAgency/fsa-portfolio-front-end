const users = {
    TEST_USER: Cypress.env('testUser'),
    TEST_USER_PASSWORD: Cypress.env('testUserPassword')
}

module.exports = users;
