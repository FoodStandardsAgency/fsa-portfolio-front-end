function toLowercaseExceptTLAs(text) {
    var regex = /\b[A-Z][a-z]+\b/g;
    return text.replace(regex, function (match) {
        return match.toLowerCase();
    });
}

module.exports = {
    toLowercaseExceptTLAs: toLowercaseExceptTLAs
};