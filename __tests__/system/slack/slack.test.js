/**
 * @jest-environment node
 */
import "dotenv/config";
import {
    startReplayForScenario,
    stopReplay,
} from "./steno/replay/stenoService";
import app from "../../../src/app";
import request from "supertest";
import closedChannelsStorage from "../../../src/services/storage/closedChannels/closed-channels.json";
import {
    getAllMethodsFromScenario,
    getSuccessMethods,
} from "./steno/replay/getScenarioMethods";
import * as snapshotMessages from "./steno/replay/snapshotMessages";

jest.mock("../../../src/services/storage/closedChannels/closed-channels.json");

console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

beforeEach(() => {
    closedChannelsStorage.splice(0);
});

// todo: to foreach
//  поэтому названия тесткейсов надо так же спрашивать при вводе имени сценария
describe("setTopic system successful ", () => {
    it("should set new topic once", async () => {
        const scenario = "set_topic_singly";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });

    it("should set only first topic if first is failed AND second the same", async () => {
        const scenario = "set_topic_2_times_1_build";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });

    it("should set successful topic for second time if first is failed AND second is success", async () => {
        const scenario = "set_topic_3_times_2_builds";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });

    it("should not set success topic if first is failed AND another is success", async () => {
        const scenario = "set_topic_2_times_2_builds";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });

    it("should set successful topic when 2 failed builds will become success", async () => {
        const scenario = "set_topic_3_times_3_builds";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });
});

describe("setTopic system failed", () => {
    it("should not set new topic", async () => {
        const scenario = "build_is_not_exist";

        await teamcityWebhookHandlerWithScenarioCheck(scenario);
    });
});

const teamcityWebhookHandlerWithScenarioCheck = async scenario => {
    await startReplayForScenario(scenario);

    const endPoint = "/teamcity-webhook";

    const requests = await snapshotMessages.getRequests(scenario);

    // it's better to exclude this check for more crush information:
    const expectedResponses = await snapshotMessages.getResponses(scenario);

    let actualResponses = [];
    for (let i = 0; i < requests.length; i++) {
        const fullResponse = await request(app)
            .post(endPoint)
            .send(requests[i]);

        const { statusCode, text } = fullResponse;

        actualResponses.push({
            statusCode,
            text,
        });
    }

    const { data } = await stopReplay();

    // check bot API responses
    // it's better to exclude this check for more crush information:
    expect(actualResponses).toStrictEqual(expectedResponses);

    // check Slack interactions:
    const slackMethods = await getAllMethodsFromScenario(scenario);
    const successSlackMethods = getSuccessMethods(data.interactions);
    expect(successSlackMethods).toStrictEqual(slackMethods);

    expect(data.meta.unmatchedCount.incoming).toBe(0);
    expect(data.meta.unmatchedCount.outgoing).toBe(0);
};
