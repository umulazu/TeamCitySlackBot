import {
    openChannel,
    saveFailureBuild,
    willTopicSet,
} from "../../../../src/services/storage/closedChannels";
import { saveToFile } from "../../../../src/services/storage/utilities";
import closedChannels from "../../../../src/services/storage/closed-channels.json";

jest.mock("../../../../src/services/storage/utilities");
// physical storage mock:
jest.mock("../../../../src/services/storage/closed-channels.json", () => [
    {
        channelName: "closed_channel_1",
        builds: [],
    },
    {
        channelName: "closed_channel_2",
        builds: ["failed_build_2", "failed_build_3"],
    },
    {
        channelName: "closed_channel_3",
        builds: ["failed_build_4"],
    },
    {
        channelName: "closed_channel_4",
        builds: [],
    },
    {
        channelName: "closed_channel_5",
        builds: ["failed_build_5"],
    },
]);
saveToFile.mockImplementation();

describe("openChannel integration", () => {
    jest.spyOn(closedChannels, "indexOf");
    jest.spyOn(closedChannels, "splice").mockImplementation();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete channel-build object from storage if builds is empty", async () => {
        const channel = closedChannels[0];

        await openChannel(channel);

        expect(closedChannels.indexOf).toBeCalled();
        expect(closedChannels.splice).toBeCalled();
    });

    it("should not delete channel-build object from storage if builds is not empty", async () => {
        const channel = closedChannels[1];

        await openChannel(channel);

        expect(closedChannels.indexOf).not.toBeCalled();
        expect(closedChannels.splice).not.toBeCalled();
    });
});

describe("saveFailureBuild integration", () => {
    beforeEach(() => {
        saveToFile.mockRestore();
    });

    it("should add to closedChannels if channel has not been already closed", async () => {
        const channelName = "new_closed_channel";
        const buildId = "new_failed_build";

        const expectedClosedChannelsCount = closedChannels.length + 1;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannels.length).toBe(expectedClosedChannelsCount);
        expect(saveToFile).toBeCalled();
    });

    it("should add new build to existing closed channel builds field", async () => {
        const channelName = "closed_channel_4";
        const buildId = "new_failed_build";

        const expectedFailedBuildCount = closedChannels[3].builds.length + 1;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannels[3].builds.length).toBe(expectedFailedBuildCount);
        expect(saveToFile).toBeCalled();
    });

    it("should not add new build to existing closed channel builds field because of build already exist", async () => {
        const channelName = "closed_channel_5";
        const buildId = "failed_build_5";

        const expectedFailedBuildCount = closedChannels[4].builds.length;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannels[4].builds.length).toBe(expectedFailedBuildCount);
        expect(saveToFile).not.toBeCalled();
    });
});

describe("willTopicSet integration", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it("should return true if channel is not closed", async () => {
        const channelName = "opened_channel";
        // could be anything:
        const buildId = "buildId";
        const isSuccess = true;

        const result = await willTopicSet(channelName, buildId, isSuccess);
        expect(result).toBeTruthy();
    });

    it("should return false if channel is closed but not because of this build", async () => {
        const channelName = "closed_channel_1";
        const buildId = "not_failed_build";
        // could be anything:
        const isSuccess = true;

        const result = await willTopicSet(channelName, buildId, isSuccess);
        expect(result).toBeFalsy();
    });

    it("should return false if channel is closed because of this build but it still not success", async () => {
        const channelName = "closed_channel_1";
        const buildId = "failed_build_1";
        const isSuccess = false;

        const result = await willTopicSet(channelName, buildId, isSuccess);
        expect(result).toBeFalsy();
    });

    it("should return false if channel is closed because of this build, now it is success but there is another one failed", async () => {
        const channelName = "closed_channel_2";
        const buildId = "failed_build_2";
        const isSuccess = true;

        const result = await willTopicSet(channelName, buildId, isSuccess);
        expect(result).toBeFalsy();
    });

    it("should return true if channel is closed because of this build and now it is success", async () => {
        const channelName = "closed_channel_3";
        const buildId = "failed_build_4";
        const isSuccess = true;

        const result = await willTopicSet(channelName, buildId, isSuccess);
        expect(result).toBeTruthy();
    });
});

