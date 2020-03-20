import * as storage from "../../../src/services/storage";
import addBuildToChannel from "../../../src/handlers/addBuildToChannel";

jest.mock("../../../src/services/storage");

describe("addBuildToChannel", () => {
    it("should send status 200", async () => {
        const channelName = "channelName";
        const buildName = "buildName";
        const req = {
            body: {
                buildName,
                channelName,
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };

        storage.saveToStorage.mockImplementation();

        await addBuildToChannel(req, res);

        expect(storage.saveToStorage).toHaveBeenCalledWith(
            channelName,
            buildName
        );
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("shouldn't send any status code", async () => {
        const channelName = "channelName";
        const buildName = "buildName";
        const req = {
            body: {
                buildName,
                channelName,
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };

        storage.saveToStorage.mockImplementation(() => {
            throw new Error("some error");
        });

        const addBuildToChannelResult = addBuildToChannel(req, res);

        expect(addBuildToChannelResult).rejects.toThrowError();
        expect(res.sendStatus).not.toHaveBeenCalled();
    });
});