import getIcon from "../../../../src/services/slack/getIcon";
import icons from "../../../../src/services/slack/icons";

describe("getIcon", function() {
    it("should return Stop mark if running", () => {
        const result = "running";
        // event is not important:
        const event = "";

        expect(getIcon(result, event)).toBe(icons["stopMark"]);
    });

    it("should return Check mark if success", () => {
        const result = "success",
            event = "buildFinished";

        expect(getIcon(result, event)).toBe(icons["checkMark"]);
    });

    it("should return Exclamation mark if failure", () => {
        const result = "failure";
        // event can be anything except "running":
        const event = "";

        expect(getIcon(result, event)).toBe(icons["exclamationMark"]);
    });

    it("should return Question mark if all the rest", () => {
        const result = "",
            event = "";

        expect(getIcon(result, event)).toBe(icons["questionMark"]);
    });
});
