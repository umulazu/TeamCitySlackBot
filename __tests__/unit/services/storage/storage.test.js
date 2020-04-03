import {
    getChannelByBuildId,
    saveToStorage,
} from "../../../../src/services/storage";
import storage from "../../../../src/services/storage/channel-build.json";
import { promises as fs } from "fs";

jest.mock("../../../../src/services/storage/channel-build.json");

describe("getChannelByBuildId", () => {
    it("should return Channel for specified Build", async () => {
        const buildId1 = "id_1";
        const channel1 = "channel_1";

        storage.find = jest.fn().mockReturnValue({
            channel: channel1,
            build: buildId1,
        });

        const desiredChannel = await getChannelByBuildId(buildId1);

        expect(desiredChannel).toBe(channel1);
    });

    it("should throw HttpError if specified build wasn't exist in storage", async () => {
        storage.find = jest.fn().mockReturnValue(null);

        await expect(getChannelByBuildId()).rejects.toThrowError();
    });
});

describe("saveToStorage", () => {
    it("should throw error", async () => {
        const buildId1 = "id_1";
        const channel1 = "channel_1";
        const err = new Error("some error");

        fs.writeFile = jest.fn();
        JSON.stringify = jest.fn().mockImplementation(() => {
            throw err;
        });

        const savedPromise = saveToStorage(channel1, buildId1);

        await expect(savedPromise).rejects.toThrowError();
    });
});
