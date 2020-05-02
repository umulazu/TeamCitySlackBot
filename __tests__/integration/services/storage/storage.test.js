import { saveChannelBuild, saveFailureBuild, willTopicSet } from "../../../../src/services/storage";
import closedChannelsStorage from "../../../../src/services/storage/closedChannels/closed-channels.json";
import { promises as fs } from "fs";
import channelBuildStorage from "../../../../src/services/storage/channelBuild/channel-build.json";

// physical storage mocks:
jest.mock("../../../../src/services/storage/closedChannels/closed-channels.json");
jest.mock("../../../../src/services/storage/channelBuild/channel-build.json");

jest.spyOn(fs, "writeFile").mockImplementation();
console.log = jest.fn();

describe("saveFailureBuild integration", () => {
    beforeEach(() => {
        closedChannelsStorage.splice(0);
    });

    it("should add to closedChannels if channel has not been already closed", async () => {
        const channelName = "new_closed_channel";
        const buildId = "new_failed_build";

        const expectedClosedChannelsCount = closedChannelsStorage.length + 1;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannelsStorage.length).toBe(expectedClosedChannelsCount);
    });

    it("should add new build to existing closed channel builds field", async () => {
        const channelName = "closed_channel";
        const buildId = "new_failed_build";
        const channel = {
            channelName,
            builds: [],
        };
        closedChannelsStorage.push(channel);

        const expectedFailedBuildCount = closedChannelsStorage[0].builds.length + 1;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannelsStorage[0].builds.length).toBe(expectedFailedBuildCount);
    });

    it("should not add new build to existing closed channel builds field because of build already exist", async () => {
        const channelName = "closed_channel";
        const buildId = "failed_build";
        const channel = {
            channelName,
            builds: [buildId],
        };
        closedChannelsStorage.push(channel);

        const expectedFailedBuildCount = closedChannelsStorage[0].builds.length;

        await saveFailureBuild(channelName, buildId);

        expect(closedChannelsStorage[0].builds.length).toBe(expectedFailedBuildCount);
    });
});

describe("willTopicSet integration", () => {
    beforeEach(() => {
        closedChannelsStorage.splice(0);
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
        const channel = {
            channelName: "closed_channel",
            builds: ["failed_build"],
        };
        closedChannelsStorage.push(channel);

        const channelName = "closed_channel";
        const buildId = "not_failed_build";
        // could be anything:
        const isSuccess = true;

        const result = await willTopicSet(channelName, buildId, isSuccess);

        expect(result).toBeFalsy();
    });

    it("should return false if channel is closed because of this build but it still not success", async () => {
        const channelName = "closed_channel";
        const buildId = "failed_build";
        const isSuccess = false;

        const channel = {
            channelName,
            builds: [buildId],
        };
        closedChannelsStorage.push(channel);

        const result = await willTopicSet(channelName, buildId, isSuccess);

        expect(result).toBeFalsy();
    });

    it("should return false if channel is closed because of this build, now it is success but there is another one failed", async () => {
        const channelName = "closed_channel";
        const buildId = "failed_build_1";
        const isSuccess = true;

        const channel = {
            channelName,
            builds: [buildId, "failed_build_2"],
        };
        closedChannelsStorage.push(channel);

        const result = await willTopicSet(channelName, buildId, isSuccess);

        expect(result).toBeFalsy();
    });

    it("should return true if channel is closed because of this build and now it is success", async () => {
        const channelName = "closed_channel";
        const buildId = "failed_build";
        const isSuccess = true;

        const channel = {
            channelName,
            builds: [buildId],
        };
        closedChannelsStorage.push(channel);

        const result = await willTopicSet(channelName, buildId, isSuccess);

        expect(result).toBeTruthy();
    });
});

describe("saveToStorage integration", () => {
    beforeEach(() => {
        channelBuildStorage.splice(0);
    });

    it("should not add new channel-build object if such object is already exist", async () => {
        const channel = "channel_1";
        const build = "id_1";

        const channelBuild = {
            channel,
            build,
        };
        channelBuildStorage.push(channelBuild);
        const expectedChannelBuildCount = channelBuildStorage.length;

        await saveChannelBuild(channel, build);

        expect(channelBuildStorage.length).toBe(expectedChannelBuildCount);
    });

    it("should add new channelBuild object to storage", async () => {
        const build = "id_1";
        const channel = "channel_1";

        const expectedChannelBuildCount = channelBuildStorage.length + 1;

        await saveChannelBuild(channel, build);

        expect(channelBuildStorage.length).toBe(expectedChannelBuildCount);
    });
});