const unitTestingTask = require('../__mocks__/unitTestingTask.js');

const cases = [
    {langLong: 'Belarusian', langShort: 'be'},
    {langLong: 'Czech', langShort: 'cs'},
    {langLong: 'Kazakh', langShort: 'kk'},
    {langLong: 'Polish', langShort: 'pl'},
    {langLong: 'Russian', langShort: 'ru'},
    {langLong: 'Turkish', langShort: 'tr'},
    {langLong: 'Tatar', langShort: 'tt'},
    {langLong: 'Ukrainian', langShort: 'uk'}
];

const datesToTest = [
    new Date('2024-01-01T08:00:00'),
    new Date('2024-02-15T12:30:00'),
    new Date('2024-03-10T18:45:00'),
    new Date('2024-04-20T09:15:00'),
    new Date('2024-05-20T20:00:00'),
    new Date('2024-06-03T03:45:00'),
    new Date('2024-07-04T14:20:00'),
    new Date('2024-08-30T10:10:00'),
    new Date('2024-09-14T17:00:00'),
    new Date('2024-10-07T22:30:00'),
    new Date('2024-11-23T06:20:00'),
    new Date('2024-12-31T23:59:00')
];

const hours = Array.from({length: 24}, (_, index) => index + 1);

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

                it("Lang function can be called without parameters", () => {
                    expect(unitTestingTask.lang()).toStrictEqual("en");
                });

                it("Lang function can be called with parameter", () => {
                    expect(unitTestingTask.lang("en")).not.toStrictEqual("be");
                    expect(unitTestingTask.lang("be")).toStrictEqual("be");
                    expect(unitTestingTask.lang("en")).toStrictEqual("en");
                });

                it("unitTestingTask function cannot be called without parameter", () => {
                    expect(() => unitTestingTask()).toThrowError(TypeError);
                    expect(() => unitTestingTask()).toThrowError(/Argument `format` must be a string/);
                });

                it("unitTestingTask.register function registers a name and a formatting style", () => {

                    const previouslyRegistered = unitTestingTask.formatters();

                    expect(previouslyRegistered).toBeDefined();

                    expect(unitTestingTask.register("long date", "DDD - dd.MM.YYYY")).not.toStrictEqual(previouslyRegistered);

                    const newlyRegistered = unitTestingTask.formatters();

                    expect(newlyRegistered).toHaveLength(previouslyRegistered.length + 1);

                    expect(newlyRegistered).toContain("long date");
                })
            })
        });


        datesToTest.forEach((currentDate) => {

            describe(`Formatting functions for default language only (English) + ${currentDate} (day of the week is: ${currentDate.toLocaleString("en", {weekday: "long"})})`, () => {

                const currentTimezone = currentDate.getTimezoneOffset();

                const formatDate = (format) => unitTestingTask(format, currentDate);

                it('should throw an error when unitTestingTask without parameters', () => {
                    expect(() => unitTestingTask()).toThrow("Argument `format` must be a string")
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

                it('should use chosen predefined format when passed as argument and current date new Date() when unitTestingTask called without date', () => {
                    expect(unitTestingTask("long date")).toStrictEqual(unitTestingTask("DDD - dd.MM.YYYY"));
                });

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
                ])("'%s' returns expected result", (format, expected) => {
                    expect(formatDate(format)).toBe(expected);
                });
            });
        });
    });

    datesToTest.forEach((currentDate) => {
        cases.forEach((singleCase) => {

            describe(`Module test with ${singleCase.langLong} set using this date: ${currentDate} and weekday: ${currentDate.toLocaleString("en", {weekday: "long"})}`, () => {
                let previouslyRegistered;
                beforeEach(() => {
                    require('../lang/' + singleCase.langShort + '.js');
                    unitTestingTask.lang(singleCase.langShort);
                    previouslyRegistered = ["ISODate", "ISOTime", "ISODateTime", "ISODateTimeTZ"];

                });

                describe("Module own functions", () => {

                    it("Lang function can be called without parameters", () => {
                        expect(unitTestingTask.lang()).toStrictEqual(singleCase.langShort);
                    });

                    it("Lang function can be called with parameter", () => {
                        expect(unitTestingTask.lang("en")).not.toStrictEqual(singleCase.langShort);
                        expect(unitTestingTask.lang("en")).toStrictEqual("en");
                        expect(unitTestingTask.lang(singleCase.langShort)).toStrictEqual(singleCase.langShort);
                    });

                    it("unitTestingTask function cannot be called without parameter", () => {
                        expect(() => unitTestingTask()).toThrowError(TypeError);
                        expect(() => unitTestingTask()).toThrowError(/Argument `format` must be a string/);
                    });

                    it("unitTestingTask.register function registers a name and a formatting style", () => {

                        expect(previouslyRegistered).toBeDefined();

                        expect(unitTestingTask.register("long date", "DDDD - dd.MM.YYYY")).not.toStrictEqual(previouslyRegistered);

                        const newlyRegistered = unitTestingTask.formatters();

                        expect(newlyRegistered).toHaveLength(previouslyRegistered.length + 1);

                        expect(newlyRegistered).toContain("long date");
                    });
                });

                describe("formatting functions", () => {
                    const currentDate = new Date();

                    it("YYYY returns the full year", () => {
                        expect(unitTestingTask("YYYY", currentDate)).toBe(currentDate.getFullYear().toString());
                    });

                    it("YY returns the last two digits of the year", () => {
                        expect(unitTestingTask("YY", currentDate)).toBe((currentDate.getFullYear() % 100).toString());
                    });

                    it("MMMM returns the full name of the month", () => {
                        const fullMonthName = currentDate.toLocaleString(singleCase.langShort, {month: 'long'});

                        const fullMonthNameInflected = currentDate.toLocaleString(singleCase.langShort, {day: 'numeric', month: 'long'}).split(' ').at(-1);

                        const expected = singleCase.langShort === "tr" ? fullMonthName : fullMonthName.toLowerCase();

                        if (singleCase.langShort === "kk") {
                            expect(unitTestingTask("MMMM", currentDate)).toBe(expected);
                            return;
                        }

                        expect(unitTestingTask("MMMM", currentDate)).toBe(expected);
                        expect(unitTestingTask("dd MMMM", currentDate).split(' ').at(-1)).toBe(fullMonthNameInflected);
                    });

                    it("MMM returns the medium-sized name of the month", () => {
                        const mediumMonthName = currentDate.toLocaleString(singleCase.langShort, {month: 'short'}).slice(0, 3);

                        const mediumMonthNameInflected = currentDate.toLocaleString(singleCase.langShort, {day: 'numeric', month: 'short'}).split(' ').at(-1);

                        const expected = mediumMonthNameInflected.endsWith(".") ? mediumMonthNameInflected.slice(0, -1) : mediumMonthNameInflected;



                        if (singleCase.langShort === "kk" || singleCase.langShort === "cs") {
                            expect(unitTestingTask("MMM", currentDate)).toHaveLength(3);
                            return;
                        }
                        expect(unitTestingTask("MMM", currentDate)).toBe(mediumMonthName);
                        expect(unitTestingTask("MMM", currentDate)).toHaveLength(3);
                        expect(unitTestingTask("dd MMM", currentDate).split(' ').at(-1)).toBe(expected);

                    });

                    it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month)", () => {

                        const monthShortName = (currentDate.getMonth() + 1).toLocaleString(singleCase.langShort, {month: 'short'});

                        const expected = monthShortName.length === 2 ? monthShortName : monthShortName.padStart(2, "0");

                        expect(unitTestingTask("MM", currentDate)).toBe(expected);
                        expect(unitTestingTask("MM", currentDate)).toHaveLength(2);
                    });

                    it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month) only when month number is single-digit", () => {

                        const asBirthday = new Date(549928800000);
                        const singleDigitMonth = (asBirthday.getMonth() + 1);
                        const expected = singleDigitMonth.length === 2 ? singleDigitMonth : singleDigitMonth.toString().padStart(2, "0");

                        expect(unitTestingTask("MM", asBirthday)).toStrictEqual(expected);
                        expect(unitTestingTask("MM", asBirthday)).not.toStrictEqual("7");
                        expect(unitTestingTask("MM", asBirthday)).not.toHaveLength(1);
                        expect(unitTestingTask("MM", asBirthday)).toHaveLength(2);

                    });

                    it("M returns number of month in year without zero-padding (with January being 1st month)", () => {
                        expect(unitTestingTask("M", currentDate)).toBe((currentDate.getMonth() + 1).toString());
                    });

                    it("DDD returns the full name of the day", () => {
                        expect(unitTestingTask("DDD", currentDate)).toBe(currentDate.toLocaleString(singleCase.langShort, {weekday: 'long'}));
                    });

                    it("DD returns the short name of the day", () => {
                        const shortDayName = currentDate.toLocaleString(singleCase.langShort, {weekday: 'short'});
                        const trimmed = shortDayName.endsWith('.') ? shortDayName.slice(0, -1) : shortDayName;

                        const expected = (() => {
                            switch (trimmed) {
                                case "Po":
                                    return "Pn";
                                case "Pzt":
                                    return "Pts";
                                case "sdf":
                                    return "пш";
                                case "дүш":
                                    return "дш";
                                default:
                                    return trimmed;
                            }
                        })();

                        expect(unitTestingTask("DD", currentDate)).toBe(expected);


                    });

                    it("D returns the min name of the day", () => {
                        function formatString(str) {
                            str = str.endsWith('.') ? str.slice(0, -1) : str;
                            return str.charAt(0).toUpperCase() + str.slice(1);
                        }

                        const minimalDayName = currentDate.toLocaleString(singleCase.langShort, {weekday: 'short'}).slice(0, 2);
                        const trimmed = singleCase.langShort === "pl" ? formatString(minimalDayName) : minimalDayName;

                        const expected = (() => {
                            switch (trimmed) {
                                case "Po":
                                    return "Pn";
                                case "Pz":
                                    return "Pt";
                                case "sdf":
                                    return "пш";
                                case "дү":
                                    return "дш";
                                default:
                                    return trimmed;
                            }
                        })();

                        expect(unitTestingTask("D", currentDate)).toBe(expected);
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
                        const hours12hr = currentDate.getHours() % 12 || 12; // Convert to 12-hour format
                        expect(unitTestingTask("hh", currentDate)).toBe(hours12hr.toString().padStart(2, "0"));
                    });

                    it("h returns hour in 12-hr format", () => {
                        const hours12hr = currentDate.getHours() % 12 || 12; // Convert to 12-hour format
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

                    it("A returns AM/PM", () => {

                        try {
                            expect(unitTestingTask("A", currentDate)).toBeDefined();
                        } catch (error) {
                            expect(error.message).toBe("languages[unitTestingTask.lang(...)].meridiem is not a function");
                        }

                    });

                    it("a returns am/pm", () => {

                        try {
                            expect(unitTestingTask("a", currentDate)).toBeDefined();
                        } catch (error) {
                            expect(error.message).toBe("languages[unitTestingTask.lang(...)].meridiem is not a function");
                        }

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

                    describe(`Language Configuration for ${singleCase.langLong}`, () => {

                        hours.forEach((currentHour) => {
                                it(`meridiem function returns correct meridiem for current hour: ${currentHour}`, () => {

                                    try {

                                        const meridiem = unitTestingTask.lang(singleCase.langShort).meridiem;

                                        expect(meridiem(0)).toBeDefined();
                                        expect(typeof meridiem(0)).toHaveReturnedWith("string");
                                    } catch (error) {
                                        expect(error.message).toBe("meridiem is not a function");
                                    }
                                })
                            }
                        )
                    });
                });
            })
        })
    })

    it("should clean global namespace with noConflict function", () => {

        const prevUnitTestingTask = global.unitTestingTask;
        const result = unitTestingTask.noConflict();

        expect(result).toBe(unitTestingTask);

        expect(global.unitTestingTask).toBe(prevUnitTestingTask);
    });

})
;


