import getIcon from "../../../../src/services/slack/getIcon";
import {
    getChannelId,
    setTopicToChannel,
    getTopicMessageTimestamp,
    deleteMessage,
} from "../../../../src/services/slack/slackApi";
import { setTopic } from "../../../../src/services/slack";
import { InternalServerError, NotFoundError } from "../../../../src/errors";

jest.mock("../../../../src/services/slack/getIcon");
jest.mock("../../../../src/services/slack/slackApi");

describe("setTopic", () => {
    const channel = "id_1";
    const icon = "icon";
    const build_name = "buildName",
        build_event = "buildEvent",
        build_result = "buildResult",
        build_result_previous = "buildResultPrevious";
    const buildInfo = {
        build_name,
        build_event,
        build_result,
        build_result_previous,
    };
    const topicTimestamp = 123;
    const timestamp = 124;

    beforeEach(() => {
        getChannelId.mockRestore();
        getIcon.mockRestore();
        setTopicToChannel.mockRestore();
        getTopicMessageTimestamp.mockRestore();
        deleteMessage.mockRestore();
    });

    it("should throw NotFoundError", async () => {
        getChannelId.mockImplementation(() => {
            throw new NotFoundError("some error");
        });

        const result = setTopic(buildInfo, channel);

        await expect(result).rejects.toThrowError(NotFoundError);
        expect(getChannelId).toBeCalledWith(channel);
        expect(getIcon).not.toHaveBeenCalled();
        expect(setTopicToChannel).not.toHaveBeenCalled();
        expect(getTopicMessageTimestamp).not.toHaveBeenCalled();
        expect(deleteMessage).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError if it's problem with slack client in setTopicToChannel()", async () => {
        getChannelId.mockReturnValue(channel);
        getIcon.mockReturnValue(icon);
        setTopicToChannel.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        const result = setTopic(buildInfo, channel);

        await expect(result).rejects.toThrowError(InternalServerError);
        expect(getChannelId).toBeCalledWith(channel);
        expect(getIcon).toBeCalledWith(build_result, build_event, build_result_previous);
        expect(setTopicToChannel).toBeCalledWith(channel, buildInfo, icon);
        expect(getTopicMessageTimestamp).not.toHaveBeenCalled();
        expect(deleteMessage).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError if it's problem with slack client in getChannelId()", async () => {
        getChannelId.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        const result = setTopic(buildInfo, channel);

        await expect(result).rejects.toThrowError(InternalServerError);
        expect(getChannelId).toBeCalledWith(channel);
        expect(getIcon).not.toHaveBeenCalled();
        expect(setTopicToChannel).not.toHaveBeenCalled();
        expect(getTopicMessageTimestamp).not.toHaveBeenCalled();
        expect(deleteMessage).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError if it's problem with slack client in getTopicMessageTimestamp()", async () => {
        getChannelId.mockReturnValue(channel);
        setTopicToChannel.mockReturnValue(topicTimestamp);
        getIcon.mockReturnValue(icon);
        getTopicMessageTimestamp.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        const result = setTopic(buildInfo, channel);

        await expect(result).rejects.toThrowError(InternalServerError);
        expect(getChannelId).toBeCalledWith(channel);
        expect(getIcon).toBeCalledWith(build_result, build_event, build_result_previous);
        expect(setTopicToChannel).toBeCalledWith(channel, buildInfo, icon);
        expect(getTopicMessageTimestamp).toBeCalledWith(channel, topicTimestamp);
        expect(deleteMessage).not.toHaveBeenCalled();
    });

    it("should throw InternalServerError if it's problem with slack client in deleteMessage()", async () => {
        getChannelId.mockReturnValue(channel);
        setTopicToChannel.mockReturnValue(topicTimestamp);
        getTopicMessageTimestamp.mockReturnValue(timestamp);
        getIcon.mockReturnValue(icon);
        deleteMessage.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        const result = setTopic(buildInfo, channel);

        await expect(result).rejects.toThrowError(InternalServerError);
        expect(getChannelId).toBeCalledWith(channel);
        expect(getIcon).toBeCalledWith(build_result, build_event, build_result_previous);
        expect(setTopicToChannel).toBeCalledWith(channel, buildInfo, icon);
        expect(deleteMessage).toHaveBeenCalledWith(channel, timestamp);
    });
});