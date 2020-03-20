import icons from "../../../../src/services/slack/icons";
import { getChannelId, setTopicToChannel } from "../../../../src/services/slack/slackApi";

let mockListResult;
let mockSetTopicResult;

jest.mock("@slack/web-api", () => ({
    WebClient: jest.fn().mockReturnValue({
        conversations: {
            list: () => mockListResult,
            setTopic: () => mockSetTopicResult,
        },
    }),
}));

describe("getChannelId", () => {
    it("should return respective Id", async () => {
        const channelName = "channel_1";
        const expectedChannelId = "id_1";

        mockListResult = {
            ok: true,
            channels: [
                {
                    name: channelName,
                    id: expectedChannelId,
                },
            ],
        };

        const channelId = await getChannelId(channelName);

        expect(channelId).toBe(expectedChannelId);
    });

    it("should return falsy if ok is false", async () => {
        const channelName = "channel_1";
        const expectedChannelId = "id_1";

        mockListResult = {
            ok: false,
            channels: [
                {
                    name: channelName,
                    id: expectedChannelId,
                },
            ],
        };

        const channelId = await getChannelId(channelName);

        expect(channelId).toBeFalsy();
    });

    it("should return falsy if list() returned null", async () => {
        const channelName = "channel_1";

        mockListResult = null;

        const channelId = await getChannelId(channelName);

        expect(channelId).toBeFalsy();
    });

    it("should return falsy if list() returned undefined", async () => {
        const channelName = "channel_1";

        mockListResult = undefined;

        const channelId = await getChannelId(channelName);

        expect(channelId).toBeFalsy();
    });

    it("should return falsy if specified channel doesn't exist", async () => {
        const channelName = "channel_1";

        mockListResult = {
            ok: false,
            channels: [
                {
                    name: "channel_2",
                    id: "id_2",
                },
            ],
        };

        const channelId = await getChannelId(channelName);

        expect(channelId).toBeFalsy();
    });

    it("should return falsy if specified channel doesn't have respective id", async () => {
        const channelName = "channel_1";

        mockListResult = {
            ok: false,
            channels: [
                {
                    name: "channel_2",
                },
            ],
        };

        const channelId = await getChannelId(channelName);

        expect(channelId).toBeFalsy();
    });
});

describe("setTopicToChannel", () => {
    it("should return truthy", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };
        const icon = icons["stopMark"];

        mockSetTopicResult = {
            ok: true,
        };

        const result = await setTopicToChannel(channel, buildInfo, icon);

        expect(result).toBeTruthy();
    });

    it("should return falsy", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };
        const icon = icons["stopMark"];

        mockSetTopicResult = {
            ok: false,
        };

        const result = await setTopicToChannel(channel, buildInfo, icon);

        expect(result).toBeFalsy();
    });
});