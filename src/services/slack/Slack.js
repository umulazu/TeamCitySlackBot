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

export const setTopicToChannel = async (channel, buildInfo, icon) => {
    const { build_name, build_event, build_result } = buildInfo;

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

export const setTopic = async (buildInfo, channelName) => {
    const { build_event, build_result } = buildInfo;

    const channel = await getChannelId(channelName);
    if (!channel) {
        throw new HttpError(404, "Please, check for channel name's updates");
    }

    const icon = getIcon(build_result, build_event);

    const isSet = await setTopicToChannel(channel, buildInfo, icon);
    if (!isSet) {
        throw new HttpError(
            500,
            "Topic hasn't been set! Repeat request later."
        );
    }
};