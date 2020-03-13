import getBuildNameFromUrl from "../../../../src/middlewares/requestValidator/getBuildNameFromUrl";

describe("getBuildNameFromUrl", () => {
    it("should return BuildName", () => {
        const url =
            "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=206";

        expect(getBuildNameFromUrl(url)).toBe(
            "PortalForStudents_FrontEnd_Test"
        );
    });

    it.each([
        "",
        "http://192.168.21.178:81/viewLog.html",
        "http://192.168.21.178:81/viewLog.html?buildId=206",
        "http://192.168.21.178:81/viewLog.html?buildTypeId&buildId=206",
        "http://192.168.21.178:81/viewLog.html?buildTypeId=&buildId=206",
        "http://192.168.21.178:81/viewLog.html?buildTypeId=1&buildId=206&buildTypeId=1",
    ])("should return falsy values", url => {
        expect(getBuildNameFromUrl(url)).toBeFalsy();
    });
});
