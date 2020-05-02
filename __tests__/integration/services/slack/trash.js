/**
 * @jest-environment node
 */
import teamcityWebhook from "../../../../src/handlers/teamcityWebhook";
import getBuildNameFromUrl from "../../../../src/utilities/getBuildNameFromUrl";
import { getChannelByBuildId, saveFailureBuild, willTopicSet } from "../../../../src/services/storage";
import { setTopic } from "../../../../src/services/slack";
import {
    deleteMessage,
    getChannelId,
    getTopicMessageTimestamp,
    setTopicToChannel,
} from "../../../../src/services/slack/slackApi";
import { WebClient } from "@slack/web-api";
import icons from "../../../../src/services/slack/icons";
describe.skip("222", () =>
{
// import axios from "axios";
// import { WebClient } from "@slack/web-api";
// process.env.SLACK_BOT_TOKEN = "xoxf-IBhndZZrdHbIfWcxzpT2FTouLMUJyyp1U2zoJKoAR5bNk9Psvn";

// jest.mock("../../../../src/services/storage/channelBuild", () => [
//     { "channel": "channel_1", "build": "build_1" },
// ]);

describe("testing_topic_will_be_set scenario ", () => {
    it("set topic from handler ", async () => {
        // await startReplayForScenario(scenario)
        //     .then(waitOneSecond)
        //     .then(stopReplay)
        //     .then(data => {
        //         console.log(data.interactions);
        //
        //         expect(data.interactions).isArray();
        //     });
        const headers = {
            "content-type": "application/json",
            "user-agent": "PostmanRuntime/7.24.1",
            "accept": "*/*",
            "cache-control": "no-cache",
            "postman-token": "5ee23124-01d0-4c48-b823-321d05e3f661",
            "host": "localhost:9000",
            "accept-encoding": "gzip, deflate, br",
            "connection": "keep-alive",
            "content-length": "456"
        };
        const body = {
            "build_start_time": "2020-05-04T16:44:15.214+03:00",
            "timestamp": "2020-05-04T16:44:19.423+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=1805",
            "build_number": "133",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const req = {
            headers,
            body
        };
        // const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

        // await axios.post("http://localhost:9000/teamcity-webhook", req.body);
        // const data = await startReplayForScenario(scenario);
        // console.log(data);
        console.log("------------------------------------------------------------");
        // await waitOneSecond();

        // const res = {};
        await teamcityWebhook(req);
        // await waitOneSecond();

        return;
        // const history = await stopReplay();
        // console.log(history);
        // const anotherData = await stopReplay();
    });
});
describe("setTopic integration", () => {
    // const channel = "id_1";
    // const icon = "icon";
    // const build_name = "buildName",
    //     build_event = "buildEvent",
    //     build_result = "buildResult",
    //     build_result_previous = "buildResultPrevious";
    // const buildInfo = {
    //     build_name,
    //     build_event,
    //     build_result,
    //     build_result_previous,
    // };

    it("should set new topic from handler ", async () => {
        // await startReplayForScenario(scenario)
        //     .then(waitOneSecond)
        //     .then(stopReplay)
        //     .then(data => {
        //         console.log(data.interactions);
        //
        //         expect(data.interactions).isArray();
        //     });
        const headers = {
            "content-type": "application/json",
            "user-agent": "PostmanRuntime/7.24.1",
            "accept": "*/*",
            "cache-control": "no-cache",
            "postman-token": "5ee23124-01d0-4c48-b823-321d05e3f661",
            "host": "localhost:9000",
            "accept-encoding": "gzip, deflate, br",
            "connection": "keep-alive",
            "content-length": "456"
        };
        const body = {
            "build_start_time": "2020-05-04T16:44:15.214+03:00",
            "timestamp": "2020-05-04T16:44:19.423+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=1805",
            "build_number": "133",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const req = {
            headers,
            body
        };
        // const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

        // await axios.post("http://localhost:9000/teamcity-webhook", req.body);
        // const data = await startReplayForScenario(scenario);
        // console.log(data);
        console.log("------------------------------------------------------------");
        // await waitOneSecond();

        // const res = {};
        await teamcityWebhook(req);
        // await waitOneSecond();

        return;
        // const history = await stopReplay();
        // console.log(history);
        // const anotherData = await stopReplay();
    });

    it("should ", async () => {
        // const req = {
        //     body: {
        //         "build_name": "NEW_BUILD_NAME1",
        //         "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=New_Build&buildId=206",
        //         "build_result": "running",
        //         "build_event": "buildFinished",
        //         "something": "set_topic_singly"
        //     }
        // };

        const buildInfo = {
            "build_start_time": "2020-05-04T16:44:15.214+03:00",
            "timestamp": "2020-05-04T16:44:19.423+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=1805",
            "build_number": "133",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const channelName = "portalforstudents_frontend";

        // await setTopic(buildInfo, channelName);
        const result = await getChannelId(channelName);
        console.log(result);
        const channel = "CTAU0MFTJ";
    });

    it("should 2 ", async () => {
        const buildInfo = {
            "build_start_time": "2020-05-04T16:44:15.214+03:00",
            "timestamp": "2020-05-04T16:44:19.423+03:00",
            "build_event": "buildStarted",
            "build_name": "Test",
            "build_status_url": "http://192.168.21.178:81/viewLog.html?buildTypeId=PortalForStudents_FrontEnd_Test&buildId=1805",
            "build_number": "133",
            "triggered_by": "admin",
            "build_result": "running",
            "build_result_previous": "success",
            "build_result_delta": "unknown"
        };
        const channel = "CTAU0MFTJ";
        // const topic = "🛑 Test on buildStarted: running";
        // const topic = `${icons.stopMark} Test on buildStarted: running`;
        const topic = `%F0%9F%9B%91 Test on buildStarted%3A running`;

        // await setTopic(buildInfo, channelName);
        const topicTimestamp = await setTopicToChannel(channel, buildInfo, topic);
        console.log(topicTimestamp);
    });

    // ok:
    it("getTopicMessageTimestamp from api.conversations.history ", async () => {
        const channel = "CTAU0MFTJ";
        const startTimestamp = "1588600001";

        const topicTimestamp = await getTopicMessageTimestamp(channel, startTimestamp);
        console.log(topicTimestamp);
    });

    // ok:
    it("deleteMessage from api.chat.delete ", async () => {
        const channel = "CTAU0MFTJ";

        const topicTimestamp = "1588600001.000500";
        await deleteMessage(channel, topicTimestamp);
    });

    it("straightly webClient ", async () => {
        const webClient = new WebClient("xoxf-h8ASq2ULyUaG7vg6IVkJCPb0P0LTO8mQsmzoB6SgAFFSlX6Woi", {
            slackApiUrl: "http://localhost:3000/api"
        });
        // const listOfConversations = await webClient.conversations.list();
        // console.log(listOfConversations);
        const channel = "CTAU0MFTJ";
        // const topic = "🛑 Test on buildStarted: running";
        const topic = "%F0%9F%9B%91%20Test%20on%20buildStarted%3A%20running";
        // const topic = `🛑 Test on buildStarted: running`;
        // const topic = `${icons.stopMark} Test on buildStarted: running`;

        // const topic = `%F0%9F%9B%91 Test on buildStarted%3A running`;

        // const topic = "%F0%9F%9B%91 Test on buildStarted%3A running";

        const isTopicSet = await webClient.conversations.setTopic({
            channel,
            topic
        });
        console.log(isTopicSet);

    });

    // ok:
    it("single setTopic from webClient ", async () => {
        jest.setTimeout(10000);

        const webClient = new WebClient(process.env.SLACK_BOT_TOKEN || "xoxf-YU0FBmJmp33Oxr2EFQbiOjoa6hRQfmDQAU9g8IKq69J3O9KF1C", {
            slackApiUrl: "http://localhost:3000/api"
        });
        // const listOfConversations = await webClient.conversations.list();
        // console.log(listOfConversations);
        const channel = "CTAU0MFTJ";
        const topic = "newTopic";

        const isTopicSet = await webClient.conversations.setTopic({
            channel,
            topic,
        });
        console.log(isTopicSet);

    });

    // ok:
    it("delete from webClient ", async () => {
        jest.setTimeout(10000);

        const webClient = new WebClient("xoxf-h8ASq2ULyUaG7vg6IVkJCPb0P0LTO8mQsmzoB6SgAFFSlX6Woi", {
            slackApiUrl: "http://localhost:3000/api"
        });
        // const listOfConversations = await webClient.conversations.list();
        // console.log(listOfConversations);
        const channel = "CTAU0MFTJ";
        const ts = "1588600001.000500";
        const token = "xoxf-DaBnU9GpUlStsNTCq6ijbHOZ7eEge78RlhpqnGDzdFf3pQVwHnkecpaBErcD6fHiyU88wftL";

        const result = await webClient.chat.delete({
            token,
            channel,
            ts,
        });
        console.log(result);
    });
});

const isSuccess = buildResult => /success/.test(buildResult);
const isFailure = buildResult => /failure/.test(buildResult);


const stenoControlPort = 4000;

const startReplayForScenario = async (scenario) => {
    return axios.post(`http://localhost:${stenoControlPort}/start`, {
        name: scenario
    });
};

const stopReplay = async () => {
    return axios.post(`http://localhost:${stenoControlPort}/stop`);
};

const waitOneSecond = async () => {
    return new Promise((r) => setTimeout(r, 2000));
};});