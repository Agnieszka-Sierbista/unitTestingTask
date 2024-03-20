const {datesToTest} = require("../__mocks__/datesToTest");

const unitTestingTask = require('../__mocks__/unitTestingTask.js');


describe("Unit Testing Task", () => {

    describe("Defaut module settings with English language", () => {

        describe("Unit Testing Task module external language dependencies agnostic", () => {

            beforeEach(() => {

                const en = unitTestingTask._languages['en']

                unitTestingTask.lang('en', en);
            });

            describe("Module general", () => {

                it('should work in CommonJS environment', () => {
                    const currentDate = '2024-01-01T08:00:00';
                    const expectedYear = new Date(currentDate).getFullYear().toString();

                    const result = unitTestingTask('YYYY', currentDate);
                    expect(typeof module.exports).toBe('object');
                    expect(result).toEqual(expectedYear);
                });
            });

            describe("Module own functions", () => {

                it("should call unitTestingTask.lang without arguments", () => {
                    expect(unitTestingTask.lang()).toStrictEqual("en");
                });

                it("should call unitTestingTask.lang with argument", () => {
                    expect(unitTestingTask.lang("be")).toStrictEqual("be");
                    expect(unitTestingTask.lang("en")).toStrictEqual("en");
                });

                it("should throw an error when unitTestingTask called without arguments", () => {
                    expect(() => unitTestingTask()).toThrowError(TypeError("Argument `format` must be a string"));
                });

                it('should throw an error when unitTestingTask called with an empty string', () => {
                    expect(() => unitTestingTask("")).toThrow("Argument `format` must be a string")
                });

                it('should throw an error when unitTestingTask called with a date that is not an instance of Date or Unix Timestamp or ISODate String', () => {
                    expect(() => unitTestingTask("YYYY", true)).toThrow("Argument `date` must be instance of Date or Unix Timestamp or ISODate String")
                });

                it('should use current date new Date() when unitTestingTask called without date', () => {
                    expect(unitTestingTask("YYYY")).toStrictEqual((new Date).getFullYear().toString())
                });

                describe("unitTestingTask.register function", () => {
                    let isolatedUnitTestingTask;
                    jest.isolateModules(() => {
                        isolatedUnitTestingTask = require('../__mocks__/unitTestingTask.js');
                    });

                    it("should register a name and a formatting style when unitTestingTask.register function is called", () => {

                        const previouslyRegistered = isolatedUnitTestingTask.formatters();

                        expect(previouslyRegistered).toBeDefined();

                        expect(isolatedUnitTestingTask.register("long date", "DDD - dd.MM.YYYY")).not.toStrictEqual(previouslyRegistered);

                        const newlyRegistered = isolatedUnitTestingTask.formatters();

                        expect(newlyRegistered).toHaveLength(previouslyRegistered.length + 1);

                        expect(newlyRegistered).toContain("long date");
                    });

                    it('should use chosen predefined format when passed as an argument', () => {
                        const date = new Date("Wed Mar 20 2024 22:52:42 GMT+0100 (Central European Standard Time)");
                        isolatedUnitTestingTask.register("long date", "DDD - dd.MM.YYYY");
                        expect(isolatedUnitTestingTask("long date", date)).toStrictEqual("Wednesday - 20.03.2024");
                    });
                });
            })
        });

        datesToTest.forEach((currentDate) => {

            describe(`Formatting functions for default language only (English) using date: ${currentDate} (day of the week is: ${currentDate.toLocaleString("en", {weekday: "long"})})`, () => {

                const currentTimezone = currentDate.getTimezoneOffset();

                const formatDate = (format) => unitTestingTask(format, currentDate);

                it.each([
                    ["YYYY", currentDate.getFullYear().toString()],
                    ["YY", (currentDate.getFullYear() % 100).toString().padStart(2, "0")],
                    ["MMMM", currentDate.toLocaleString("en", {month: 'long'})],
                    ["MMM", currentDate.toLocaleString("en", {month: 'short'})],
                    ["MM", (currentDate.getMonth() + 1).toString().padStart(2, "0")],
                    ["MM", (currentDate.getMonth() + 1).toString().padStart(2, "0")],
                    ["M", (currentDate.getMonth() + 1).toString()],
                    ["DDD", currentDate.toLocaleString("en", {weekday: 'long'})],
                    ["DD", currentDate.toLocaleString("en", {weekday: 'short'})],
                    ["D", currentDate.toLocaleString("en", {weekday: 'short'}).slice(0, 2)],
                    ["dd", currentDate.getDate().toString().padStart(2, "0")],
                    ["d", currentDate.getDate().toString()],
                    ["HH", currentDate.getHours().toString().padStart(2, "0")],
                    ["H", currentDate.getHours().toString()],
                    ["hh", (currentDate.getHours() % 12 || 12).toString().padStart(2, "0")],
                    ["h", (currentDate.getHours() % 12 || 12).toString()],
                    ["mm", currentDate.getMinutes().toString().padStart(2, "0")],
                    ["m", currentDate.getMinutes().toString()],
                    ["ss", currentDate.getSeconds().toString().padStart(2, "0")],
                    ["s", currentDate.getSeconds().toString()],
                    ["ff", currentDate.getMilliseconds().toString().padStart(3, "0")],
                    ["f", currentDate.getMilliseconds().toString()],
                    ["A", currentDate.toLocaleString("en", {
                        hour: 'numeric',
                        hour12: true
                    }).split(' ').at(-1).toUpperCase()],
                    ["a", currentDate.getHours() >= 12 ? "pm" : "am"],
                    ["ZZ", `${currentTimezone > 0 ? '-' : '+'}${Math.abs(Math.floor(currentTimezone / 60)).toString().padStart(2, "0")}${Math.abs(currentTimezone % 60).toString().padStart(2, "0")}`],
                    ["Z", `${currentTimezone > 0 ? '-' : '+'}${Math.abs(Math.floor(currentTimezone / 60)).toString().padStart(2, "0")}:${Math.abs(currentTimezone % 60).toString().padStart(2, "0")}`],
                ])("'%s' returns expected date format", (format, expected) => {
                    expect(formatDate(format)).toBe(expected);
                });
            });
        });
    });

    it("should clean global namespace with noConflict function", () => {

        const prevUnitTestingTask = global.unitTestingTask;
        const result = unitTestingTask.noConflict();

        expect(result).toBe(unitTestingTask);

        expect(global.unitTestingTask).toBe(prevUnitTestingTask);
    });
})
;


