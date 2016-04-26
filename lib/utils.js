/**
 * Capitalize the first letter of each word
 * @function capitalizeWords
 * @param {String} str Text to format
 * @return {String} Cleaned git tag
 */
export function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * Removes 'v' from git tag
 * @function cleanTagName
 * @param {String} tag Git tag
 * @return {String} Cleaned git tag
 */
export function cleanTagName(tag) {
    return tag.replace(/^v/i, '');
}

/**
 * Removes line breaks from commit messages and adds author name.
 * @function formatMessage
 * @param {String} message Commit message
 * @param {String} username User id
 * @return {String} Formatted commit message
 */
export function formatMessage(message, username) {
    return message.replace('\n\n', '. ') + ' (@' + username + ')';
}

/**
 * Helper function to check if string exists text
 * @function isNot
 * @param {String} text Message text
 * @param {String} subject Text to look for
 * @return {Boolean} Validation
 */
export function isNot(text, subject) {
    return text.indexOf(subject) === -1;
}
