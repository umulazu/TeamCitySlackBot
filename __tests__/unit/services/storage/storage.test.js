import { getChannelByBuildId } from "../../../../src/services/storage/Storage";

describe.skip("getChannelByBuildId", function() {
    it("should return Channel for specified Build", () => {
        jest.mock("../../../../src/services/storage/storage");
    });
});