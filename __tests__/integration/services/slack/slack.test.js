/**
 * @jest-environment node
 */

import "dotenv/config";
import { startReplayForScenario, stopReplay } from "../../../stenoService";
import app from "../../../../src/app";
import request from "supertest";
import closedChannelsStorage from "../../../../src/services/storage/closedChannels/closed-channels.json";

jest.mock(
    "../../../../src/services/storage/closedChannels/closed-channels.json"
);

// could be turn on for debugging:
// console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

beforeEach(() => {
    closedChannelsStorage.splice(0);
});

describe("setTopic integration successful ", () => {
    it("should set new topic once", async () => {
        const scenario = "set_topic_singly";
        const requests = [];

        const buildInfo = {
            build_start_time: "2020-05-04T16:44:15.214+03:00",
            timestamp: "2020-05-04T16:44:19.423+03:00",
            build_event: "buildStarted",
            build_name: "Test",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=1805",
            build_number: "133",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "success",
            build_result_delta: "unknown",
        };
        requests.push(buildInfo);

        const expectedInteractionsCount = 4;
        await teamcityHandlerWithScenarioCheck(scenario, requests, expectedInteractionsCount);
    });

    it("should set only first topic if first is failed AND second the same", async () => {
        const scenario = "set_topic_2_times_1_build";
        const requests = [];

        const build1StartedInfo = {
            build_start_time: "2020-05-08T22:04:22.967+03:00",
            timestamp: "2020-05-08T22:04:48.756+03:00",
            build_event: "buildStarted",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1831",
            build_number: "25",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "failure",
            build_result_delta: "unknown",
        };
        const build1FinishedInfo = {
            build_start_time: "2020-05-08T22:04:50.957+03:00",
            timestamp: "2020-05-08T22:05:00.172+03:00",
            build_finish_time: "2020-05-08T22:05:00.172+03:00",
            build_event: "buildFinished",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1831",
            build_number: "25",
            triggered_by: "admin",
            build_result: "failure",
            build_result_previous: "failure",
            build_result_delta: "unchanged",
        };
        requests.push(build1StartedInfo, build1FinishedInfo);

        const build2StartedInfo = {
            build_start_time: "2020-05-08T22:05:33.555+03:00",
            timestamp: "2020-05-08T22:05:36.231+03:00",
            build_event: "buildStarted",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1832",
            build_number: "26",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "failure",
            build_result_delta: "unknown",
        };
        const build2FinishedInfo = {
            build_start_time: "2020-05-08T22:05:37.745+03:00",
            timestamp: "2020-05-08T22:05:48.451+03:00",
            build_finish_time: "2020-05-08T22:05:48.451+03:00",
            build_event: "buildFinished",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1832",
            build_number: "26",
            triggered_by: "admin",
            build_result: "failure",
            build_result_previous: "failure",
            build_result_delta: "unchanged",
        };
        requests.push(build2StartedInfo, build2FinishedInfo);

        const expectedInteractionsCount = 8;
        await teamcityHandlerWithScenarioCheck(scenario, requests, expectedInteractionsCount);
    });

    it("should set successful topic for second time if first is failed AND second is success", async () => {
        const scenario = "set_topic_3_times_2_builds";
        const requests = [];

        const build1StartedInfo = {
            build_start_time: "2020-05-08T22:34:07.525+03:00",
            timestamp: "2020-05-08T22:34:17.002+03:00",
            build_event: "buildStarted",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1838",
            build_number: "32",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "failure",
            build_result_delta: "unknown",
        };
        const build1FinishedInfo = {
            build_start_time: "2020-05-08T22:34:18.284+03:00",
            timestamp: "2020-05-08T22:34:29.367+03:00",
            build_finish_time: "2020-05-08T22:34:29.367+03:00",
            build_event: "buildFinished",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1838",
            build_number: "32",
            triggered_by: "admin",
            build_result: "failure",
            build_result_previous: "failure",
            build_result_delta: "unchanged",
        };
        requests.push(build1StartedInfo, build1FinishedInfo);

        const build2StartedInfo = {
            build_start_time: "2020-05-08T22:36:05.617+03:00",
            timestamp: "2020-05-08T22:36:05.640+03:00",
            build_event: "buildStarted",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1839",
            build_number: "33",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "failure",
            build_result_delta: "unknown",
        };
        const build2FinishedInfo = {
            build_start_time: "2020-05-08T22:36:06.962+03:00",
            timestamp: "2020-05-08T22:36:30.053+03:00",
            build_finish_time: "2020-05-08T22:36:30.053+03:00",
            build_event: "buildFinished",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1839",
            build_number: "33",
            triggered_by: "admin",
            build_result: "success",
            build_result_previous: "failure",
            build_result_delta: "fixed",
        };
        requests.push(build2StartedInfo, build2FinishedInfo);

        const expectedInteractionsCount = 12;
        await teamcityHandlerWithScenarioCheck(scenario, requests, expectedInteractionsCount);
    });

    it("should not set success topic if first is failed AND another is success", async () => {
        const scenario = "set_topic_2_times_2_builds";
        const requests = [];

        const build1StartedInfo = {
            build_start_time: "2020-05-09T11:35:03.146+03:00",
            timestamp: "2020-05-09T11:35:09.408+03:00",
            build_event: "buildStarted",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1840",
            build_number: "34",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "success",
            build_result_delta: "unknown",
        };
        const build1FinishedInfo = {
            build_start_time: "2020-05-09T11:35:10.666+03:00",
            timestamp: "2020-05-09T11:35:22.040+03:00",
            build_finish_time: "2020-05-09T11:35:22.040+03:00",
            build_event: "buildFinished",
            build_name: "ProdBuild",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1840",
            build_number: "34",
            triggered_by: "admin",
            build_result: "failure",
            build_result_previous: "success",
            build_result_delta: "broken",
        };
        requests.push(build1StartedInfo, build1FinishedInfo);

        const build2StartedInfo = {
            build_start_time: "2020-05-09T11:35:39.318+03:00",
            timestamp: "2020-05-09T11:35:39.337+03:00",
            build_event: "buildStarted",
            build_name: "Test",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1841",
            build_number: "145",
            triggered_by: "admin",
            build_result: "running",
            build_result_previous: "success",
            build_result_delta: "unknown",
        };
        const build2FinishedInfo = {
            build_start_time: "2020-05-09T11:35:40.480+03:00",
            timestamp: "2020-05-09T11:36:01.965+03:00",
            build_finish_time: "2020-05-09T11:36:01.965+03:00",
            build_event: "buildFinished",
            build_name: "Test",
            build_status_url:
                "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1841",
            build_number: "145",
            triggered_by: "admin",
            build_result: "success",
            build_result_previous: "success",
            build_result_delta: "unchanged",
        };
        requests.push(build2StartedInfo, build2FinishedInfo);

        const expectedInteractionsCount = 8;
        await teamcityHandlerWithScenarioCheck(scenario, requests, expectedInteractionsCount);
    });

    it("should set successful topic when 2 failed builds will become success", async () => {
        const scenario = "set_topic_3_times_3_builds";
        const requests = [];

        const build1StartedInfo = {
            "build_start_time": "2020-05-09T20:22:46.319+03:00",
            "timestamp": "2020-05-09T20:22:49.170+03:00",
            "build_event": "buildStarted",
            "build_name": "ProdBuild",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1849",
            "build_number": "38",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const build1FinishedInfo = {
            "build_start_time": "2020-05-09T20:22:50.716+03:00",
            "timestamp": "2020-05-09T20:23:01.361+03:00",
            "build_finish_time": "2020-05-09T20:23:01.361+03:00",
            "build_event": "buildFinished",
            "build_name": "ProdBuild",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1849",
            "build_number": "38",
            "triggered_by": "admin",
            "build_result": "failure",
            "build_result_previous": "success",
            "build_result_delta": "broken"
        };
        requests.push(build1StartedInfo, build1FinishedInfo);

        const build2StartedInfo = {
            "build_start_time": "2020-05-09T20:23:23.182+03:00",
            "timestamp": "2020-05-09T20:23:23.203+03:00",
            "build_event": "buildStarted",
            "build_name": "testing123",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForTests_Testing123&buildId=1850",
            "build_number": "31",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const build2FinishedInfo = {
            "build_start_time": "2020-05-09T20:23:27.169+03:00",
            "timestamp": "2020-05-09T20:23:33.752+03:00",
            "build_finish_time": "2020-05-09T20:23:33.752+03:00",
            "build_event": "buildFinished",
            "build_name": "testing123",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForTests_Testing123&buildId=1850",
            "build_number": "31",
            "triggered_by": "admin",
            "build_result": "failure",
            "build_result_previous": "success",
            "build_result_delta": "broken"
        };
        requests.push(build2StartedInfo, build2FinishedInfo);

        const build3StartedInfo = {
            "build_start_time": "2020-05-09T20:23:41.965+03:00",
            "timestamp": "2020-05-09T20:23:41.990+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1851",
            "build_number": "147",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const build3FinishedInfo = {
            "build_start_time": "2020-05-09T20:23:43.213+03:00",
            "timestamp": "2020-05-09T20:24:03.912+03:00",
            "build_finish_time": "2020-05-09T20:24:03.912+03:00",
            "build_event": "buildFinished",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1851",
            "build_number": "147",
            "triggered_by": "admin",
            "build_result": "success",
            "build_result_previous": "success",
            "build_result_delta": "unchanged"
        };
        requests.push(build3StartedInfo, build3FinishedInfo);

        const build4StartedInfo = {
            "build_start_time": "2020-05-09T20:24:30.523+03:00",
            "timestamp": "2020-05-09T20:24:30.545+03:00",
            "build_event": "buildStarted",
            "build_name": "ProdBuild",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1852",
            "build_number": "39",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "failure",
            "build_result_delta": "unknown"
        };
        const build4FinishedInfo = {
            "build_start_time": "2020-05-09T20:24:31.956+03:00",
            "timestamp": "2020-05-09T20:24:54.033+03:00",
            "build_finish_time": "2020-05-09T20:24:54.033+03:00",
            "build_event": "buildFinished",
            "build_name": "ProdBuild",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_ProdBuild&buildId=1852",
            "build_number": "39",
            "triggered_by": "admin",
            "build_result": "success",
            "build_result_previous": "failure",
            "build_result_delta": "fixed"
        };
        requests.push(build4StartedInfo, build4FinishedInfo);

        const build5StartedInfo = {
            "build_start_time": "2020-05-09T20:25:09.352+03:00",
            "timestamp": "2020-05-09T20:25:09.370+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1853",
            "build_number": "148",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const build5FinishedInfo = {
            "build_start_time": "2020-05-09T20:25:10.586+03:00",
            "timestamp": "2020-05-09T20:25:29.156+03:00",
            "build_finish_time": "2020-05-09T20:25:29.156+03:00",
            "build_event": "buildFinished",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForSlackBotTests_Test&buildId=1853",
            "build_number": "148",
            "triggered_by": "admin",
            "build_result": "success",
            "build_result_previous": "success",
            "build_result_delta": "unchanged"
        };
        requests.push(build5StartedInfo, build5FinishedInfo);

        const build6StartedInfo = {
            "build_start_time": "2020-05-09T20:26:04.375+03:00",
            "timestamp": "2020-05-09T20:26:04.398+03:00",
            "build_event": "buildStarted",
            "build_name": "testing123",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForTests_Testing123&buildId=1854",
            "build_number": "32",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "failure",
            "build_result_delta": "unknown"
        };
        const build6FinishedInfo = {
            "build_start_time": "2020-05-09T20:26:06.542+03:00",
            "timestamp": "2020-05-09T20:26:27.119+03:00",
            "build_finish_time": "2020-05-09T20:26:27.119+03:00",
            "build_event": "buildFinished",
            "build_name": "testing123",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=ForTests_Testing123&buildId=1854",
            "build_number": "32",
            "triggered_by": "admin",
            "build_result": "success",
            "build_result_previous": "failure",
            "build_result_delta": "fixed"
        };
        requests.push(build6StartedInfo, build6FinishedInfo);

        const expectedInteractionsCount = 12;
        await teamcityHandlerWithScenarioCheck(scenario, requests, expectedInteractionsCount);
    });
});

describe("setTopic integration failed", () => {
    it("should not set new topic", async () => {
        const endPoint = "/teamcity-webhook";

        const buildInfo = {
            "build_start_time": "2020-05-09T22:12:59.889+03:00",
            "timestamp": "2020-05-09T22:12:59.911+03:00",
            "build_event": "buildStarted",
            "build_name": "NotExistingBuild",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=NotExistingBuild&buildId=1856",
            "build_number": "34",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };

        let response;
        console.error = jest.fn();
        try {
            response = await request(app)
                .post(endPoint)
                .send(buildInfo);
        } catch (e) {
            expect(typeof e).toBe("NotFoundError");
        }
        expect(response.statusCode).toBe(404);

    });
});

const teamcityHandlerWithScenarioCheck = async (scenario, requests, expectedInteractionsCount) => {
    await startReplayForScenario(scenario);

    const endPoint = "/teamcity-webhook";

    for (let i = 0; i < requests.length; i++) {
        const result = await request(app)
            .post(endPoint)
            .send(requests[i]);
    }

    const { data } = await stopReplay();

    console.log(data.interactions);
    expect(data.interactions.length).toBe(expectedInteractionsCount);
    expect(data.meta.unmatchedCount.incoming).toBe(0);
    expect(data.meta.unmatchedCount.outgoing).toBe(0);
};

// сделать проверки в каждом тесте более детальными. или передавать в универсальную функцию teamcityHandlerWithScenarioCheck еще и эталон.
//  сравнивать и хранить в diff поля request{} и response{ body: { "ok": true } }

// мб, в snapshots.json хранить сразу конкатенированную строку???


// ожидаем список с interactions к данному сценарию, а получаем текущий список interactions.
// тогда по нему можно будет понять, какие interactions произошли, и на каком остановились.
// <- проверяем это с помощью jest-diff.
// IF you want to update old scenario, please run npm script:
// concurrently -k -s first "npm:steno:record --scenario-name имя_сценария" "npm:start_app:record" "node updateScenario.js имя_сценария(без аргументов -> все сценарии)"
