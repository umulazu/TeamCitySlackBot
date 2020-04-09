import { getChannelByBuildId, isExist } from "../../../../src/services/storage/channelBuild";
import storage from "../../../../src/services/storage/channel-build.json";

jest.mock("../../../../src/services/storage/channel-build.json", () => ([
    { "channel": "channel1", "build": "build1" },
    { "channel": "channel2", "build": "build2" }
]));

describe("getChannelByBuildId", () => {
    it("should return Channel for specified Build", async () => {
        const buildId1 = "id_1";
        const channel1 = "channel_1";

        jest.spyOn(storage, "find").mockReturnValue({
            channel: channel1,
            build: buildId1,
        });

        const desiredChannel = await getChannelByBuildId(buildId1);

        expect(desiredChannel).toBe(channel1);
    });

    it("should throw HttpError if specified build wasn't exist in storage", async () => {
        jest.spyOn(storage, "find").mockReturnValue(null);

        await expect(getChannelByBuildId()).rejects.toThrowError();
    });
});

describe("isExist", () => {
    it("should return truthy value if it is already exist", async () => {
        jest.spyOn(storage, "find").mockRestore();
        const channel = "channel1";
        const build = "build1";

        const result = await isExist(channel, build);

        expect(result).toBeTruthy();
    });

    it("should return falsy value if it is not yet exist", async () => {
        jest.spyOn(storage, "find").mockRestore();
        const channel = "channel3";
        const build = "build3";

        const result = await isExist(channel, build);

        expect(result).toBeFalsy();
    });
});