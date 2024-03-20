const unitTestingTask = require('../../__mocks__/unitTestingTask.js');
const {datesToTest} = require("../../__mocks__/datesToTest.js");
const {hours} = require('../../__mocks__/hours');
const language = {long: "Ukrainian", short: "uk"};

describe("[Unit Testing Task]: Ukrainian language", () => {

    beforeEach(() => {
        require('../' + language.short + '.js');
        unitTestingTask.lang(language.short);
    });

    describe("Module own functions", () => {

        it("should call unitTestingTask.lang() without arguments", () => {
            expect(unitTestingTask.lang()).toStrictEqual(language.short);
        });

        it("should call unitTestingTask.lang() with argument", () => {
            expect(unitTestingTask.lang(language.short)).not.toStrictEqual("en");
            expect(unitTestingTask.lang(language.short)).toStrictEqual("uk");
        });

        it("should throw an error when unitTestingTask function is called without arguments", () => {
            expect(() => unitTestingTask()).toThrowError(TypeError("Argument `format` must be a string"));
        });

        it("should register a name and a formatting style when unitTestingTasks.register called with arguments", () => {
            let isolatedUnitTestingTask;
            jest.isolateModules(() => {
                isolatedUnitTestingTask = require('../../__mocks__/unitTestingTask.js');
            });

            require('../' + language.short + '.js');
            isolatedUnitTestingTask.lang(language.short);
            let previouslyRegistered = isolatedUnitTestingTask.formatters();

            expect(previouslyRegistered).toBeDefined();
            expect(isolatedUnitTestingTask.register("long date", "DDDD - dd.MM.YYYY")).not.toStrictEqual(previouslyRegistered);

            const newlyRegistered = isolatedUnitTestingTask.formatters();
            expect(newlyRegistered).toHaveLength(previouslyRegistered.length + 1);
            expect(newlyRegistered).toContain("long date");
        });
    });

    datesToTest.forEach((currentDate) => {

        describe(`Formatting functions results when unitTestingTask("formatting", ${currentDate}) called`, () => {

            it("YYYY returns the full year", () => {
                expect(unitTestingTask("YYYY", currentDate)).toBe(currentDate.getFullYear().toString());
            });

            it("YY returns the last two digits of the year", () => {
                expect(unitTestingTask("YY", currentDate)).toBe((currentDate.getFullYear() % 100).toString().padStart(2, "0"));
            });

            it("MMMM returns the full name of the month", () => {
                const fullMonthName = currentDate.toLocaleString(language.short, {month: 'long'});

                expect(unitTestingTask("MMMM", currentDate)).toBe(fullMonthName);
            });

            it("dd MMMM returns the full name of the month inflected", () => {

                const fullMonthNameInflected = currentDate.toLocaleString(language.short, {
                    day: 'numeric',
                    month: 'long'
                }).split(' ').at(-1);

                expect(unitTestingTask("dd MMMM", currentDate).split(' ').at(-1)).toBe(fullMonthNameInflected);
            });

            it("MMM returns the medium-sized name of the month", () => {
                const mediumMonthName = currentDate.toLocaleString(language.short, {month: 'short'}).slice(0, 3);
                const expected = (() => {
                    switch (mediumMonthName) {
                        case "кві":
                            return "квіт";
                        case "тра":
                            return "трав";
                        case "чер":
                            return "черв";
                        case "сер":
                            return "серп";
                        case "жов":
                            return "жовт";
                        case "лис":
                            return "лист";
                        case "гру":
                            return "груд";
                        default:
                            return mediumMonthName
                    }
                })();
                expect(unitTestingTask("MMM", currentDate)).toBe(expected);
            });

            it("dd MMM returns the medium-sized name of the month inflected", () => {

                const mediumMonthNameInflected = currentDate.toLocaleString(language.short, {
                    day: 'numeric',
                    month: 'short',
                }).split(' ').at(-1).slice(0, 3);
                const expected = (() => {
                    switch (mediumMonthNameInflected) {
                        case "кві":
                            return "квіт";
                        case "тра":
                            return "трав";
                        case "чер":
                            return "черв";
                        case "сер":
                            return "серп";
                        case "жов":
                            return "жовт";
                        case "лис":
                            return "лист";
                        case "гру":
                            return "груд";
                        default:
                            return mediumMonthNameInflected
                    }
                })();
                expect(unitTestingTask("dd MMM", currentDate).split(' ').at(-1)).toBe(expected);

            });

            it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month)", () => {

                const monthShortName = (currentDate.getMonth() + 1).toLocaleString(language.short, {month: 'short'});

                const expected = monthShortName.length === 2 ? monthShortName : monthShortName.padStart(2, "0");

                expect(unitTestingTask("MM", currentDate)).toBe(expected);
                expect(unitTestingTask("MM", currentDate)).toHaveLength(2);
            });

            it("M returns number of month in year without zero-padding (with January being 1st month)", () => {
                expect(unitTestingTask("M", currentDate)).toBe((currentDate.getMonth() + 1).toString());
            });

            it("DDD returns the full name of the day", () => {

                expect(unitTestingTask("DDD", currentDate)).toBe(currentDate.toLocaleString(language.short, {weekday: 'long'}).replace("ʼ", "’"));
            });

            it("DD returns the short name of the day", () => {

                const shortDayName = currentDate.toLocaleString(language.short, {weekday: 'short'});
                const trimmed = shortDayName.slice(0, 3);

                expect(unitTestingTask("DD", currentDate)).toBe(trimmed);
            });

            it("D returns the min name of the day", () => {

                const minimalDayName = currentDate.toLocaleString(language.short, {weekday: 'short'}).slice(0, 2);

                expect(unitTestingTask("D", currentDate)).toBe(minimalDayName);
            });

            it("dd returns the zero-padded number of day in month", () => {
                expect(unitTestingTask("dd", currentDate)).toBe(currentDate.getDate().toString().padStart(2, "0"));
            });

            it("d returns the number of day in month", () => {
                expect(unitTestingTask("d", currentDate)).toBe(currentDate.getDate().toString());
            });

            it("HH returns zero-padded hour in 24-hr format", () => {
                expect(unitTestingTask("HH", currentDate)).toBe(currentDate.getHours().toString().padStart(2, "0"));
            });

            it("H returns hour in 24-hr format", () => {
                expect(unitTestingTask("H", currentDate)).toBe(currentDate.getHours().toString());
            });

            it("hh returns zero-padded hour in 12-hr format", () => {
                const hours12hr = currentDate.getHours() % 12 || 12;
                expect(unitTestingTask("hh", currentDate)).toBe(hours12hr.toString().padStart(2, "0"));
            });

            it("h returns hour in 12-hr format", () => {
                const hours12hr = currentDate.getHours() % 12 || 12;
                expect(unitTestingTask("h", currentDate)).toBe(hours12hr.toString());
            });

            it("mm returns zero-padded minutes", () => {
                expect(unitTestingTask("mm", currentDate)).toBe(currentDate.getMinutes().toString().padStart(2, "0"));
            });

            it("m returns minutes", () => {
                expect(unitTestingTask("m", currentDate)).toBe(currentDate.getMinutes().toString());
            });

            it("ss returns zero-padded seconds", () => {
                expect(unitTestingTask("ss", currentDate)).toBe(currentDate.getSeconds().toString().padStart(2, "0"));
            });

            it("s returns seconds", () => {
                expect(unitTestingTask("s", currentDate)).toBe(currentDate.getSeconds().toString());
            });

            it("ff returns zero-padded milliseconds", () => {
                expect(unitTestingTask("ff", currentDate)).toBe(currentDate.getMilliseconds().toString().padStart(3, "0"));
            });

            it("f returns milliseconds", () => {
                expect(unitTestingTask("f", currentDate)).toBe(currentDate.getMilliseconds().toString());
            });

            it("ZZ returns time-zone in ISO8601-compatible basic format for negative offset (i.e. '-0700')", () => {
                const currentTimezone = currentDate.getTimezoneOffset();

                const hours = Math.abs(Math.floor(currentTimezone / 60));
                const mins = Math.abs(currentTimezone % 60);
                const sign = currentTimezone > 0 ? '-' : '+';

                const expected = `${sign}${hours.toString().padStart(2, "0")}${mins.toString().padStart(2, "0")}`;

                expect(unitTestingTask("ZZ", currentDate)).toBe(expected);
            });

            it("Z returns time-zone in ISO8601-compatible extended format (i.e. '-04:00')", () => {
                const tzOffset = currentDate.getTimezoneOffset();
                const hours = Math.abs(Math.floor(tzOffset / 60));
                const mins = tzOffset % 60;
                const sign = tzOffset > 0 ? '-' : '+';

                expect(unitTestingTask("Z", currentDate)).toBe(`${sign}${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
            });
        });
    })

    it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month) only when month number is single-digit", () => {

        const someDate = new Date('2024-07-04T14:20:00');
        const singleDigitMonth = (someDate.getMonth() + 1);
        const expected = singleDigitMonth.length === 2 ? singleDigitMonth : singleDigitMonth.toString().padStart(2, "0");

        expect(unitTestingTask("MM", someDate)).toStrictEqual(expected);
        expect(unitTestingTask("MM", someDate)).not.toStrictEqual("7");
        expect(unitTestingTask("MM", someDate)).not.toHaveLength(1);
        expect(unitTestingTask("MM", someDate)).toHaveLength(2);

    });

    describe("Meridiem function returns correctly 'rano', or nothing when A or a passed as format", () => {

        const testCases = [
            {hour: "0", expected: 'ночі'},
            {hour: "1", expected: 'ночі'},
            {hour: "2", expected: 'ночі'},
            {hour: "3", expected: 'ночі'},
            {hour: "4", expected: 'ранку'},
            {hour: "5", expected: 'ранку'},
            {hour: "6", expected: 'ранку'},
            {hour: "7", expected: 'ранку'},
            {hour: "8", expected: 'ранку'},
            {hour: "9", expected: 'ранку'},
            {hour: "10", expected: 'ранку'},
            {hour: "11", expected: 'ранку'},
            {hour: "12", expected: 'дня'},
            {hour: "13", expected: 'дня'},
            {hour: "14", expected: 'дня'},
            {hour: "15", expected: 'дня'},
            {hour: "16", expected: 'дня'},
            {hour: "17", expected: 'вечора'},
            {hour: "18", expected: 'вечора'},
            {hour: "19", expected: 'вечора'},
            {hour: "20", expected: 'вечора'},
            {hour: "21", expected: 'вечора'},
            {hour: "22", expected: 'вечора'},
            {hour: "23", expected: 'вечора'},
        ];

        testCases.forEach(({hour, expected}) => {
            it(`Should return "${expected}" for ${hour}`, () => {
                const date = new Date();
                date.setHours(hour);
                expect(unitTestingTask("A", date)).toBeDefined();
                expect(unitTestingTask("a", date)).toStrictEqual(expected);
            });
        });
    });

    it("should clean global namespace with noConflict function", () => {
        let isolatedUnitTestingTask;
        jest.isolateModules(() => {
            isolatedUnitTestingTask = require('../../__mocks__/unitTestingTask.js');
        });

        const prevUnitTestingTask = global.isolatedUnitTestingTask;
        const result = isolatedUnitTestingTask.noConflict();

        expect(result).toBe(isolatedUnitTestingTask);

        expect(global.unitTestingTask).toBe(prevUnitTestingTask);
    });

})