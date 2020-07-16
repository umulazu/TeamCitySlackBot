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
    getScenariosWithDescription,
    getSuccessMethods,
} from "./steno/replay/scenarios";
import * as snapshotMessages from "./steno/replay/snapshotMessages";

jest.mock("../../../src/services/storage/closedChannels/closed-channels.json");

console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

beforeEach(() => {
    closedChannelsStorage.splice(0);
});

const teamcityWebhookHandlerWithScenarioCheck = ({ scenario }) => {
    it("", async () => {
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
    })
};

const scenariosWithDescription = getScenariosWithDescription();

describe.each(scenariosWithDescription)("%p", teamcityWebhookHandlerWithScenarioCheck);
