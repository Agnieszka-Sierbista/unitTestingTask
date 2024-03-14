require('../../unitTestingTask')
const unitTestingTask = require('../be.js');

describe('Module to test', () => {
    test('Functionality', () => {

        console.log(Object.keys(unitTestingTask))

        expect(unitTestingTask).toBeDefined();

    });
    test('Functionality', () => {
        expect(window).toBeDefined();

    });


});
