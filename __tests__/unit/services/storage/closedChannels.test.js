import {
    closeChannel,
    deleteBuildId,
    getClosedChannel,
    isBuildFailed,
    openChannel,
} from "../../../../src/services/storage/closedChannels";
import closedChannels from "../../../../src/services/storage/closedChannels/closed-channels";

// physical storage mock:
jest.mock(
    "../../../../src/services/storage/closedChannels/closed-channels.json"
);

describe("getClosedChannel", () => {
    beforeEach(() => {
        closedChannels.splice(0);
    });

    it("should return closed channel object by channelName if storage contains it", async () => {
        const channelName = "channel_1";
        const channel = {
            channelName,
        };
        closedChannels.push(channel);

        const result = await getClosedChannel(channelName);

        expect(result).toBeTruthy();
    });

    it("should return -1 if storage does not contain channelName", async () => {
        const channelName = "it_is_not_exist";

        const result = await getClosedChannel(channelName);

        expect(result).toBeFalsy();
    });
});

describe("isBuildFailed", () => {
    beforeEach(() => {
        closedChannels.splice(0);
    });

    it("should return true if builds field contains buildId", async () => {
        const buildId = "build_1";
        const channel = {
            channelName: "channel_1",
            builds: [buildId],
        };
        closedChannels.push(channel);

        const result = await isBuildFailed(channel, buildId);

        expect(result).toBeTruthy();
    });

    it("should return false if builds field does not contain buildId", async () => {
        const buildId = "new_build";
        const channel = {
            channelName: "channel_1",
            builds: ["build_1", "build_2"],
        };
        closedChannels.push(channel);

        const result = await isBuildFailed(channel, buildId);

        expect(result).toBeFalsy();
    });
});

describe("deleteBuildId", () => {
    beforeEach(() => {
        closedChannels.splice(0);
    });

    it("should delete build from builds field if it exists there", async () => {
        const buildId = "new_build";
        const channel = {
            channelName: "new_channel",
            builds: ["build_1", buildId],
        };
        closedChannels.push(channel);

        const arrayDeletedBuild = await deleteBuildId(channel, buildId);

        expect(channel.builds.length).toBe(1);
        expect(arrayDeletedBuild[0]).toBe(buildId);
    });

    it("should not delete build from builds field if it does not exist there", async () => {
        const buildId = "new_build";
        const channel = {
            channelName: "new_channel",
            builds: ["build_1", "build_2"],
        };
        closedChannels.push(channel);

        const arrayDeletedBuild = await deleteBuildId(channel, buildId);

        expect(channel.builds.length).toBe(2);
        expect(arrayDeletedBuild).toBeUndefined();
    });
});

describe("openChannel", () => {
    beforeEach(() => {
        closedChannels.splice(0);
    });

    it("should delete channel from storage if it does not contain builds", async () => {
        const channel = {
            channelName: "channel_1",
            builds: [],
        };
        closedChannels.push(channel);

        await openChannel(channel);

        expect(closedChannels.length).toBe(0);
    });

    it("should not delete channel from storage if it builds field is not empty", async () => {
        const channel = {
            channelName: "channel_1",
            builds: ["build_1"],
        };
        closedChannels.push(channel);

        await openChannel(channel);

        expect(closedChannels.length).toBe(1);
    });
});

describe("closeChannel", () => {
    beforeEach(() => {
        closedChannels.splice(0);
    });

    it("should add channelBuild object to storage ", async () => {
        const channelName = "new_channel";
        const buildId = "new_build";

        await closeChannel(channelName, buildId);

        expect(closedChannels.length).toBe(1);
    });

    it("should duplicate adding object", async () => {
        const channelName = "new_channel";
        const buildId = "new_build";

        await closeChannel(channelName, buildId);
        await closeChannel(channelName, buildId);

        expect(closedChannels.length).toBe(2);
    });
});
