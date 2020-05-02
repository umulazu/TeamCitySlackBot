import { WebClient } from "@slack/web-api";
import { InternalServerError, NotFoundError } from "../../errors";
// import stenos from "../../../__tests__/integration/steno.config";

let webClient;
let userToken;
// const steno = stenos["FAKE_BOT_TOKEN"];

switch (process.env.NODE_ENV) {
    case ("test_record"):
        webClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
            slackApiUrl: process.env.FAKE_API_URL
        });
        userToken = process.env.SLACK_USER_TOKEN;

        break;
    case ("test"):
        webClient = new WebClient(process.env.FAKE_BOT_TOKEN, {
            slackApiUrl: process.env.FAKE_API_URL
        });
        userToken = process.env.FAKE_USER_TOKEN;

        break;
    default:
        webClient = new WebClient(process.env.SLACK_BOT_TOKEN);
        userToken = process.env.SLACK_USER_TOKEN;
}


export const getChannelId = async channelName => {
    const result = await webClient.conversations.list();
    checkResult(result, "Slack client is not answered! Repeat request later.");

    const listOfChannels = result.channels;

    const channel = listOfChannels.find(
        channel => channel.name === channelName
    );

    if (channel && channel.id) {
        return channel.id;
    } else {
        throw new NotFoundError(
            `There is no ${channelName}. Please, check for channel name's updates.`
        );
    }
};

export const setTopicToChannel = async (channel, buildInfo, icon) => {
    const {
        build_name,
        build_event,
        build_result,
        build_result_previous,
    } = buildInfo;

    // because of event buildInterrupted with status running:
    const isInterrupted = build_event === "buildInterrupted";
    const status = isInterrupted ? build_result_previous : build_result;

    const topic = `${icon}${build_name}-${build_event}:${status}`;
    const result = await webClient.conversations.setTopic({
        channel,
        topic,
    });

    checkResult(result, "Topic hasn't been set! Repeat request later.");

    return result.channel.topic.last_set;
};

export const getTopicMessageTimestamp = async (channel, startTimestamp) => {
    const result = await webClient.conversations.history({
        oldest: startTimestamp,
        channel,
    });

    checkResult(result, "Can't get last message!");

    const topicMessage = result.messages.find(
        message => message.subtype === "channel_topic"
    );

    if (!(topicMessage && topicMessage.ts)) {
        throw new InternalServerError("There is no channel_topic message");
    }

    return topicMessage.ts;
};

export const deleteMessage = async (channel, ts) => {
    const token = userToken;

    const result = await webClient.chat.delete({
        token,
        channel,
        ts,
    });

    checkResult(result, "Topic chat message hasn't been removed!");
};

const checkResult = (result, message) => {
    if (!(result && result.ok)) {
        throw new InternalServerError(message);
    }
};