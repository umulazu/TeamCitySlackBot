import getIcon from "../../../../src/services/slack/getIcon";
import icons from "../../../../src/services/slack/icons";

describe("getIcon", function() {
    it("should return Stop mark if running and not interrupted", () => {
        const result = "running";
        // event, previousResult can be anything:
        const event = "";
        const previousResult = "";

        expect(getIcon(result, event, previousResult)).toBe(icons.stopMark);
    });

    it("should return Stop mark if running, interrupted and previous result is not success", () => {
        const result = "running";
        const event = "buildInterrupted";
        // previousResult can be anything
        const previousResult = "";

        expect(getIcon(result, event, previousResult)).toBe(icons.stopMark);
    });

    it("should return Check mark if running, interrupted and previous result is success", () => {
        const result = "running";
        const event = "buildInterrupted";
        const previousResult = "success";

        expect(getIcon(result, event, previousResult)).toBe(icons.checkMark);
    });

    it("should return Check mark if success", () => {
        const result = "success";
        // event, previousResult can be anything:
        const event = "";
        const previousResult = "";

        expect(getIcon(result, event, previousResult)).toBe(icons.checkMark);
    });

    it("should return Stop mark if failure", () => {
        const result = "failure";
        // event, previousResult can be anything:
        const event = "";
        const previousResult = "";

        expect(getIcon(result, event, previousResult)).toBe(icons.stopMark);
    });

    it("should return Question mark if all the rest", () => {
        const result = "";
        const event = "";
        const previousResult = "";

        expect(getIcon(result, event, previousResult)).toBe(icons.questionMark);
    });
});
