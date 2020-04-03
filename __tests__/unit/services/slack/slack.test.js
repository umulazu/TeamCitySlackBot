import getIcon from "../../../../src/services/slack/getIcon";
import {
    getChannelId,
    setTopicToChannel,
} from "../../../../src/services/slack/slackApi";
import { setTopic } from "../../../../src/services/slack";
import icons from "../../../../src/services/slack/icons";
import { InternalServerError, NotFoundError } from "../../../../src/errors";

jest.mock("../../../../src/services/slack/getIcon");
jest.mock("../../../../src/services/slack/slackApi");

describe("setTopic", () => {
    it("should throw NotFoundError", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };

        getChannelId.mockImplementation(() => {
            throw new NotFoundError("some error");
        });

        await expect(setTopic(buildInfo, channel)).rejects.toThrowError(
            NotFoundError
        );
    });

    it("should throw InternalServerError if it's problem with slack client in setTopicToChannel()", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };

        const icon = icons.stopMark;
        getIcon.mockReturnValue(icon);
        getChannelId.mockRestore();
        setTopicToChannel.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        await expect(setTopic(buildInfo, channel)).rejects.toThrowError(
            InternalServerError
        );
    });

    it("should throw InternalServerError if it's problem with slack client in getChannelId()", async () => {
        const channel = "id_1";
        const buildInfo = {
            build_name: "buildName",
            build_event: "buildEvent",
            build_result: "buildResult",
        };

        const icon = icons.stopMark;
        getIcon.mockReturnValue(icon);
        setTopicToChannel.mockRestore();
        getChannelId.mockImplementation(() => {
            throw new InternalServerError("some error");
        });

        await expect(setTopic(buildInfo, channel)).rejects.toThrowError(
            InternalServerError
        );
    });
});
