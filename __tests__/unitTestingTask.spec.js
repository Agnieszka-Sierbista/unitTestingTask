const unitTestingTask = require('../unitTestingTask.js');
const factory = require('../unitTestingTask.js');

const mockFactory = jest.fn((root) => {
    root.unitTestingTask = factory(root);
});

// jest.mock('../lang/be.js', () => {
//     const myFactory = new mockFactory();
//
//     return jest.fn().mockImplementation(myFactory);
// });

const add = () => 1;

const cases = [['uk', 1], ['be', 2]];

describe("'add' utility", () => {
    test.each(cases)(
        "test %x with the result of %y",
        (xyz, expectedResult) => {
            console.log('xyz', xyz);
            // const result = add(firstArg, secondArg)
            require('../lang/' + xyz + '.js');
            unitTestingTask.lang(xyz)
            // expect().toEqual(expectedResult);
            expect(unitTestingTask.lang()).toEqual(expectedResult);

        }
    );
});

describe('sdfsdf', () => {

  describe('sdlfjl32j4', () => {
      ['../lang/be.js'].forEach((xyz) => {
          require(xyz);

          it(xyz, () => {
              expect(unitTestingTask.lang()).toBe(xyz);
          })
      })
  })

   describe('sdf', () => {
       ['../lang/uk.js'].forEach((xyz) => {
           require(xyz);

           it(xyz, () => {
               expect(unitTestingTask.lang()).toBe(xyz);
           })
       })
   })

    // test.each('eeee', ['a', 'b'], (xyz) => {
    //     console.log(xyz);
    //     expect(1).toBe(xyz);
    // })

})

describe("Unit Testing Task module", () => {

    describe("Module general", () => {

        test("Is module present", () => {
            expect(unitTestingTask).toBeDefined();
        });

        // it("Exports correctly for AMD environment", () => {
        //     const root = {};
        //     const define = (deps, callback) => {
        //         const module = {};
        //         callback();
        //         expect(module.exports).toBe(root.unitTestingTask);
        //     };
        //     console.log("root, factory", root, global)
        //
        //     define.amd = true;
        //     factory(root, factory);
        //     console.log("root, factory", root, global)
        //
        // });

        // it("Exports correctly for CommonJS environment", () => {
        //     const root = {};
        //     const module = { exports: {} };
        //     global.module = module;
        //     factory(root, factory);
        //     expect(module.exports).toBe(root.unitTestingTask);
        //     console.log("root, factory", root, global)
        //
        //     delete global.module;
        // });

        it("Exports correctly for browser environment", () => {
            // console.log(root, global)
            expect(global).toBeDefined();
            expect(global).toStrictEqual(window);
            // expect(global.unitTestingTask).toBeDefined()
            // expect(mockFactory).toHaveBeenCalledWith(global);
        });
    });


    it("Lang function can be called without parameters", () => {
        expect(unitTestingTask.lang()).toStrictEqual("en");
    });

    it("Lang function can be called with parameter", () => {
        expect(unitTestingTask.lang("be")).not.toStrictEqual("be");
        expect(unitTestingTask.lang("be")).toStrictEqual("en");
    });

    it("unitTestingTask function cannot be called without parameter", () => {
        expect(() => unitTestingTask()).toThrowError(TypeError);
        expect(() => unitTestingTask()).toThrowError(/Argument `format` must be a string/);
    });

    it("unitTestingTask.register function registers a name and a formatting style", () => {
        const previouslyRegistered = unitTestingTask.formatters();
        expect(unitTestingTask.register("long date", "DDDD - dd.MM.YYYY")).not.toStrictEqual(previouslyRegistered);
        const newlyRegistered = unitTestingTask.formatters();
        expect(newlyRegistered).toHaveLength(previouslyRegistered.length + 1);
        expect(newlyRegistered).toContain("long date");
    })

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
        expect(unitTestingTask("MMMM", currentDate)).toBe(currentDate.toLocaleString('en', {month: 'long'}));
    });

    it("MMM returns the short name of the month", () => {
        expect(unitTestingTask("MMM", currentDate)).toBe(currentDate.toLocaleString('en', {month: 'short'}));
    });

    it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month)", () => {
        // const xxx = unitTestingTask("MM", currentDate);
        // console.log(xxx)
        expect(unitTestingTask("MM", currentDate)).toBe((currentDate.getMonth() + 1).toString().length === 2 ? (currentDate.getMonth() + 1).toString() : (currentDate.getMonth() + 1).toString().padStart(2, "0"));
        expect(unitTestingTask("MM", currentDate)).toHaveLength(2);
    });

    it("MM returns ISO8601-compatible number of month (i.e. zero-padded) in year (with January being 1st month) only when month number is single-digit", () => {
        const asBirthday = new Date(549928800000);
        expect(unitTestingTask("MM", asBirthday)).not.toBe((asBirthday.getMonth() + 1).toString().length === 2 ? (asBirthday.getMonth() + 1).toString() : (asBirthday.getMonth() + 1).toString());
        expect(unitTestingTask("MM", asBirthday)).not.toStrictEqual("7");
        expect(unitTestingTask("MM", asBirthday)).not.toHaveLength(1);

    });

    it("M returns number of month in year without zero-padding (with January being 1st month)", () => {
        const decemberDate = new Date(549928800000);
        expect(unitTestingTask("M", currentDate)).toBe((currentDate.getMonth() + 1).toString());
    });

    it("DDD returns the full name of the day", () => {
        expect(unitTestingTask("DDD", currentDate)).toBe(currentDate.toLocaleString('en', {weekday: 'long'}));
    });

    it("DD returns the short name of the day", () => {
        expect(unitTestingTask("DD", currentDate)).toBe(currentDate.toLocaleString('en', {weekday: 'short'}));
    });

    it("D returns the min name of the day", () => {
        expect(unitTestingTask("D", currentDate)).toBe(currentDate.toLocaleString('en', {weekday: 'short'}).slice(0, 2));
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
        expect(unitTestingTask("A", currentDate)).toBe(currentDate.getHours() >= 12 ? "PM" : "AM");
    });

    it("a returns am/pm", () => {
        expect(unitTestingTask("a", currentDate)).toBe(currentDate.getHours() >= 12 ? "pm" : "am");
    });

    it("ZZ returns time-zone in ISO8601-compatible basic format for negative offset (i.e. '-0700')", () => {
        const currentTimezone = currentDate.getTimezoneOffset();
        const targetTimezoneOffset = -420; // Target timezone offset, for example, GMT-07:00

        const timezoneDifference = currentTimezone - targetTimezoneOffset;

        const hours = Math.abs(Math.floor(timezoneDifference / 60));
        const mins = Math.abs(timezoneDifference % 60);
        const sign = timezoneDifference > 0 ? '-' : '+';

        const expected = `${sign}${hours.toString().padStart(2, "0")}${mins.toString().padStart(2, "0")}`;

        expect(unitTestingTask("ZZ", currentDate)).toBe(expected);
    });

    it("ZZ returns time-zone in ISO8601-compatible basic format for positive offset (i.e. '+0300')", () => {
        const currentTimezone = currentDate.getTimezoneOffset();
        const targetTimezoneOffset = 180; // Target timezone offset, for example, GMT+03:00

        const timezoneDifference = currentTimezone - targetTimezoneOffset;

        const hours = Math.abs(Math.floor(timezoneDifference / 60));
        const mins = Math.abs(timezoneDifference % 60);
        const sign = timezoneDifference > 0 ? '-' : '+';

        const expected = `${sign}${hours.toString().padStart(2, "0")}${mins.toString().padStart(2, "0")}`;

        expect(unitTestingTask("ZZ", currentTimezone + targetTimezoneOffset)).toBe(expected);
    });

    it("Z returns time-zone in ISO8601-compatible extended format (i.e. '-04:00')", () => {
        const tzOffset = currentDate.getTimezoneOffset();
        const hours = Math.abs(Math.floor(tzOffset / 60));
        const mins = tzOffset % 60;
        const sign = tzOffset > 0 ? '-' : '+';

        expect(unitTestingTask("Z", currentDate)).toBe(`${sign}${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
    });
});
