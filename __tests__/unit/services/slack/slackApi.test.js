import icons from "../../../../src/services/slack/icons";
import {
    getChannelId,
    setTopicToChannel,
    getTopicMessageTimestamp,
    deleteMessage
} from "../../../../src/services/slack/slackApi";
import { InternalServerError, NotFoundError } from "../../../../src/errors";

let mockListResult;
let mockSetTopicResult;
let mockHistoryResult;
let mockDeleteResult;

jest.mock("@slack/web-api", () => ({
    WebClient: jest.fn().mockReturnValue({
        conversations: {
            list: () => mockListResult,
            setTopic: () => mockSetTopicResult,
            history: () => mockHistoryResult,
        },
        chat: {
            delete: () => mockDeleteResult
        }
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

    it("should throw InternalServerError if ok is false", async () => {
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

        const channelId = getChannelId(channelName);

        expect(channelId).rejects.toThrow(InternalServerError);
    });

    it("should throw InternalServerError if list() returned null", async () => {
        const channelName = "channel_1";

        mockListResult = null;

        const channelId = getChannelId(channelName);

        expect(channelId).rejects.toThrow(InternalServerError);
    });

    it("should throw InternalServerError if list() returned undefined", async () => {
        const channelName = "channel_1";

        mockListResult = undefined;

        const channelId = getChannelId(channelName);

        expect(channelId).rejects.toThrow(InternalServerError);
    });

    it("should throw NotFoundError if specified channel doesn't exist", async () => {
        const channelName = "channel_1";

        mockListResult = {
            ok: true,
            channels: [
                {
                    name: "channel_2",
                    id: "id_2",
                },
            ],
        };

        const channelId = getChannelId(channelName);

        expect(channelId).rejects.toThrowError(NotFoundError);
    });

    it("should throw NotFoundError if specified channel doesn't have respective id", async () => {
        const channelName = "channel_1";

        mockListResult = {
            ok: true,
            channels: [
                {
                    name: "channel_2",
                },
            ],
        };

        const channelId = getChannelId(channelName);

        expect(channelId).rejects.toThrow(NotFoundError);
    });
});

describe("setTopicToChannel", () => {
    it("should return undefined if all is OK", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };
        const icon = icons.stopMark;

        const expectedLastSet = 123;
        mockSetTopicResult = {
            ok: true,
            channel: {
                topic: {
                    last_set: expectedLastSet
                }
            }
        };

        const result = await setTopicToChannel(channel, buildInfo, icon);

        await expect(result).toBe(expectedLastSet);
    });

    it("should throw InternalServerError if ok value is false", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
            build_result_previous: "buildResultPrevious"
        };
        const icon = icons.stopMark;

        mockSetTopicResult = {
            ok: false,
        };

        const result = setTopicToChannel(channel, buildInfo, icon);

        expect(result).rejects.toThrow(InternalServerError);
    });
});

describe("getTopicMessageTimestamp", () => {
    it("should return ts of subtype message if all is OK", async () => {
        const channel = "id_1";
        const startTimestamp = 123;

        const expectedTs = 124;
        mockHistoryResult = {
            ok: true,
            messages: [
                {
                    subtype: "channel_topic",
                    ts: expectedTs
                },
                {
                    ts: "125"
                }
            ]
        };

        const result = await getTopicMessageTimestamp(channel, startTimestamp);

        await expect(result).toBe(expectedTs);
    });

    it("should throw InternalServerError if ok value is false", async () => {
        const channel = "id_1";
        const startTimestamp = 123;

        mockHistoryResult = {
            ok: false,
        };

        const result = getTopicMessageTimestamp(channel, startTimestamp);

        expect(result).rejects.toThrow(InternalServerError);
    });

    it("should throw InternalServerError if there is no subtype message", async () => {
        const channel = "id_1";
        const startTimestamp = 123;

        mockHistoryResult = {
            ok: true,
            messages: [
                {
                    ts: "124"
                },
                {
                    ts: "125"
                }
            ]
        };

        const result = getTopicMessageTimestamp(channel, startTimestamp);

        expect(result).rejects.toThrow(InternalServerError);
    });

    it("should throw InternalServerError if there is no ts field/value in subtype message", async () => {
        const channel = "id_1";
        const startTimestamp = 123;

        mockHistoryResult = {
            ok: true,
            messages: [
                {
                    subtype: "channel_topic"
                }
            ]
        };

        const result = getTopicMessageTimestamp(channel, startTimestamp);

        expect(result).rejects.toThrow(InternalServerError);
    });
});

describe("deleteMessage", () => {
    it("should return undefined if ok value is true", async () => {
        const channel = "id_1";
        const ts = 123;

        mockDeleteResult = {
            ok: true,
        };

        const result = await deleteMessage(channel, ts);

        await expect(result).toBe(undefined);
    });

    it("should throw InternalServerError if ok value is false", async () => {
        const channel = "id_1";
        const ts = 123;

        mockHistoryResult = {
            ok: false,
        };

        const result = deleteMessage(channel, ts);

        expect(result).rejects.toThrow(InternalServerError);
    });
});