const users = {
    TEST_ADMIN_USER: { username: Cypress.env('testAdminUser'), password: Cypress.env('testAdminUserPassword') },
    TEST_EDITOR_USER: { username: Cypress.env('testEditorUser'), password: Cypress.env('testEditorUserPassword') },
    TEST_READER_USER: { username: Cypress.env('testReaderUser'), password: Cypress.env('testReaderUserPassword') }
}

module.exports = users;
