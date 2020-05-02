import {
    getChannelByBuildId,
    isExist,
} from "../../../../src/services/storage/channelBuild";
import channelBuildStorage from "../../../../src/services/storage/channelBuild/channel-build.json";

jest.mock("../../../../src/services/storage/channelBuild/channel-build.json");

describe("getChannelByBuildId", () => {
    it("should return Channel for specified Build", async () => {
        const build = "id_1";
        const channel = "channel_1";

        jest.spyOn(channelBuildStorage, "find").mockReturnValue({
            channel: channel,
            build: build,
        });

        const desiredChannel = await getChannelByBuildId(build);

        expect(desiredChannel).toBe(channel);
    });

    it("should throw HttpError if specified build wasn't exist in storage", async () => {
        jest.spyOn(channelBuildStorage, "find").mockReturnValue(null);

        await expect(getChannelByBuildId()).rejects.toThrowError();
    });
});

describe("isExist", () => {
    beforeEach(() => {
        channelBuildStorage.splice(0);
        jest.spyOn(channelBuildStorage, "find").mockRestore();
    });

    it("should return truthy value if it is already exist", async () => {
        const channel = "channel_1";
        const build = "build_1";

        const channelBuild = {
            channel,
            build,
        };
        channelBuildStorage.push(channelBuild);

        const result = await isExist(channel, build);

        expect(result).toBeTruthy();
    });

    it("should return falsy value if it is not yet exist", async () => {
        const channel = "channel3";
        const build = "build3";

        const result = await isExist(channel, build);

        expect(result).toBeFalsy();
    });
});
