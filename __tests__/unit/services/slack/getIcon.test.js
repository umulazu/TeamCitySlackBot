import getIcon from "../../../../src/services/slack/getIcon";

describe("getIcon", function() {
    it("should return Stop mark if running", () => {
        const result = "running";
        // event is not important:
        const event = "";

        const stopMark = `${String.fromCodePoint(0x1f6d1)}`;

        expect(getIcon(result, event)).toBe(stopMark);
    });

    it("should return Check mark if success", () => {
        const result = "success",
            event = "buildFinished";

        const checkMark = `${String.fromCodePoint(0x2714)}`;

        expect(getIcon(result, event)).toBe(checkMark);
    });

    it("should return Exclamation mark if failure", () => {
        const result = "failure";
        // event can be anything except "running":
        const event = "";

        const exclamationMark = `${String.fromCodePoint(0x2757)}`;

        expect(getIcon(result, event)).toBe(exclamationMark);
    });

    it("should return Question mark if all the rest", () => {
        const result = "",
            event = "";

        const questionMark = `${String.fromCodePoint(0x2753)}`;

        expect(getIcon(result, event)).toBe(questionMark);
    });
});
