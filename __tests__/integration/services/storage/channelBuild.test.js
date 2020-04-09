import { promises as fs } from "fs";
import { saveToStorage } from "../../../../src/services/storage/channelBuild";
import storage from "../../../../src/services/storage/channel-build";

jest.mock("../../../../src/services/storage/channel-build.json");

describe("saveToStorage integration", () => {
    console.log = jest.fn();

    it("should throw error if there is problem with json format", async () => {
        const build = "id_1";
        const channel = "channel_1";
        const err = new Error("some error");

        fs.writeFile = jest.fn();
        storage.find = jest.fn().mockReturnValue(undefined);
        JSON.stringify = jest.fn().mockImplementation(() => {
            throw err;
        });

        const savedPromise = saveToStorage(channel, build);

        await expect(fs.writeFile).not.toHaveBeenCalled();
        await expect(savedPromise).rejects.toThrowError();
    });

    it("should throw error if such object is already exist", async () => {
        const build = "id_1";
        const channel = "channel_1";

        fs.writeFile = jest.fn();
        JSON.stringify = jest.fn();
        storage.push = jest.fn();
        storage.find = jest.fn().mockReturnValue(true);

        const savedPromise = await saveToStorage(channel, build);

        expect(savedPromise).toBeUndefined();
        expect(storage.push).not.toHaveBeenCalled();
        expect(fs.writeFile).not.toHaveBeenCalled();
        expect(JSON.stringify).not.toHaveBeenCalled();
    });

    it("should executed properly if everything is ok", async () => {
        const build = "id_1";
        const channel = "channel_1";

        fs.writeFile = jest.fn();
        JSON.stringify = jest.fn();
        storage.push = jest.fn();
        storage.find = jest.fn().mockReturnValue(false);

        const savedPromise = await saveToStorage(channel, build);

        expect(savedPromise).toBeUndefined();
        expect(storage.push).toHaveBeenCalledWith({
            channel,
            build
        });
        expect(fs.writeFile).toHaveBeenCalled();
        expect(JSON.stringify).toHaveBeenCalled();
    });
});
