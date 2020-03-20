import * as storage from "../../../src/services/storage";
import * as slack from "../../../src/services/slack";
import teamcityWebhook from "../../../src/handlers/teamcityWebhook";

jest.mock("../../../src/services/storage");
jest.mock("../../../src/services/slack");
console.log = jest.fn();

describe("teamcityWebhook", () => {
    it("should send status 200", async () => {
        const channelName = "channelName";
        const buildStatusUrl = "buildStatusUrl";
        const buildInfo = {
            build_status_url: buildStatusUrl
        };

        const req = {
            body: buildInfo
        };
        const res = {
            sendStatus: jest.fn(),
        };

        storage.getChannelByBuildId.mockImplementation(() => channelName);
        slack.setTopic.mockImplementation();

        await teamcityWebhook(req, res);

        expect(storage.getChannelByBuildId).toHaveBeenCalledWith(
            buildStatusUrl
        );
        expect(slack.setTopic).toHaveBeenCalledWith(
            buildInfo,
            channelName
        );
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("shouldn't send any status because of error in getChannelByBuildId", async () => {
        const buildStatusUrl = "buildStatusUrl";
        const buildInfo = {
            build_status_url: buildStatusUrl
        };

        const req = {
            body: buildInfo
        };
        const res = {
            sendStatus: jest.fn(),
        };

        storage.getChannelByBuildId.mockImplementation(() => {
            throw new Error("some error");
        });
        slack.setTopic.mockImplementation();

        const teamcityWebhookResult = teamcityWebhook(req, res);

        expect(teamcityWebhookResult).rejects.toThrowError();
        expect(res.sendStatus).not.toHaveBeenCalledWith();
    });

    it("shouldn't send any status because of error in setTopic", async () => {
        const buildStatusUrl = "buildStatusUrl";
        const buildInfo = {
            build_status_url: buildStatusUrl
        };

        const req = {
            body: buildInfo
        };
        const res = {
            sendStatus: jest.fn(),
        };

        storage.getChannelByBuildId.mockImplementation();
        slack.setTopic.mockImplementation(() => {
            throw new Error("some error");
        });

        const teamcityWebhookResult = teamcityWebhook(req, res);

        expect(teamcityWebhookResult).rejects.toThrowError();
        expect(res.sendStatus).not.toHaveBeenCalledWith();
    });
});
