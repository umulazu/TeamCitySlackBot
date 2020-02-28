import { WebClient } from "@slack/web-api";
import getIcon from "./getIcon";
import HttpError from "../../helpers/HttpError";

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export const getChannelId = async channelName => {
    try {
        const result = await webClient.conversations.list();
        if (!result && !result.ok) {
            return;
        }

        const listOfChannels = result.channels;

        const channel = listOfChannels.find(
            channel => channel.name === channelName
        );

        return channel && channel.id;
    } catch (error) {
        throw error;
    }
};

export const setTopicToChannel = async topicArguments => {
    const {
        channel,
        build_name,
        build_event,
        build_result,
        icon,
    } = topicArguments;

    try {
        const result = await webClient.conversations.setTopic({
            channel,
            topic: `${icon} ${build_name} on ${build_event}: ${build_result}`,
        });

        return result && result.ok;
    } catch (error) {
        throw error;
    }
};

export const setTopic = async rawArguments => {
    const {
        channel_name,
        build_name,
        build_event,
        build_result,
    } = rawArguments;

    const channel = await getChannelId(channel_name);
    if (!channel) {
        throw new HttpError(404, "Please, check for channel name's updates");
    }

    const icon = getIcon(build_result, build_event);

    const topicArguments = {
        channel,
        build_name,
        build_event,
        build_result,
        icon,
    };

    const isSet = await setTopicToChannel(topicArguments);
    if (!isSet) {
        throw new HttpError(500, "Topic hasn't been set! Repeat request later.");
    }
};