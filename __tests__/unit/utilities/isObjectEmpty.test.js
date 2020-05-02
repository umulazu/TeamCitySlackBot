import isObjectEmpty from "../../../src/utilities/isObjectEmpty";

describe("isObjectEmpty", () => {
    it("shouldn't be empty", () => {
        const obj1 = 123;

        expect(isObjectEmpty(obj1)).toBeFalsy();

        const obj2 = {
            buildName: "PortalForStud",
            channelName: "BackEnd Tests111",
        };

        expect(isObjectEmpty(obj2)).toBeFalsy();
    });

    it("should be empty", () => {
        const obj1 = {};

        expect(isObjectEmpty(obj1)).toBeTruthy();

        const obj2 = new Object();

        expect(isObjectEmpty(obj2)).toBeTruthy();
    });
});
