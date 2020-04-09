import {
    deleteBuildId,
    getClosedChannel,
    isBuildFailed,
} from "../../../../src/services/storage/closedChannels";

// physical storage mock:
jest.mock("../../../../src/services/storage/closed-channels.json", () => [
    {
        channelName: "frontend",
        builds: ["FrontEnd_Test"],
    },
    {
        channelName: "backend",
        builds: ["BackEnd_Test", "BackEnd_Prod"],
    },
]);

describe("getClosedChannel", () => {
    it("should return channel by name if storage contains it", async () => {
        const channelName = "frontend";

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
    it("should return true if builds field contains buildId", async () => {
        const buildId = "FrontEnd_Test";
        const channel = {
            channelName: "frontend",
            builds: ["FrontEnd_Prod", buildId],
        };

        const result = await isBuildFailed(channel, buildId);

        expect(result).toBeTruthy();
    });

    it("should return false if builds field does not contain buildId", async () => {
        const buildId = "FrontEnd_Test";
        const channel = {
            channelName: "frontend",
            builds: ["FrontEnd_Prod", "BackEnd_Test"],
        };

        const result = await isBuildFailed(channel, buildId);

        expect(result).toBeFalsy();
    });
});

describe("deleteBuildId", () => {
    it("should delete build from builds field if it exists there", async () => {
        const buildId = "FrontEnd_Test";
        const channel = {
            channelName: "frontend",
            builds: ["FrontEnd_Prod", buildId],
        };

        expect(channel.builds.length).toBe(2);

        const arrayDeletedBuild = await deleteBuildId(channel, buildId);

        expect(channel.builds.length).toBe(1);
        expect(arrayDeletedBuild[0]).toBe(buildId);
    });

    it("should not delete build from builds field if it does not exist there", async () => {
        const buildId = "FrontEnd_Test";
        const channel = {
            channelName: "frontend",
            builds: ["FrontEnd_Prod", "BackEnd_Test"],
        };

        expect(channel.builds.length).toBe(2);

        const arrayDeletedBuild = await deleteBuildId(channel, buildId);

        expect(channel.builds.length).toBe(2);
        expect(arrayDeletedBuild).toBeUndefined();
    });
});