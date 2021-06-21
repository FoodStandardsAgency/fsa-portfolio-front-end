const txt = require('../app/libs/textUtils');
const assert = require('assert');

describe('Convert text to lowercase, respecting acronyms', () => {
    var string = "Phase FSA RAG Status";
    const expected = "phase FSA RAG status";
    it(`Should convert \'${string}\' to \'${expected}\'`, () => {
        var actual = txt.toLowercaseExceptTLAs(string);
        assert.equal(actual, expected);
    });
});

