const {
    stripTags
} = require('../utils/helpers');

describe('stripTags helper function', () => {

    test('it should strip all tags from a string (without attributes)', () => {

        const result = stripTags('<p>This is a <b>paragraph</b> with tags</p>');

        expect(result).toBe('This is a paragraph with tags');

    });

    test('it should strip all tags from a string (with attributes)', () => {

        const result = stripTags('<p id="paragraph">This is a <b script="alert();">paragraph</b> with tags</p>');

        expect(result).toBe('This is a paragraph with tags');

    });


})