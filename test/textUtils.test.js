const txt = require('../app/libs/textUtils');
const assert = require('assert');

describe('Convert text to lowercase, respecting acronyms', () => {
    var string = "I Am Using An iPhone FT At The FSA";
    const expected = "I am using an iPhone FT at the FSA";
    it(`Should convert \'${string}\' to \'${expected}\'`, () => {
        var actual = txt.toLowercaseExceptTLAs(string);
        assert.equal(actual, expected);
    });
});

