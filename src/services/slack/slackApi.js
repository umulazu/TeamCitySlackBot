import { WebClient } from "@slack/web-api";
import { InternalServerError, NotFoundError } from "../../errors";

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export const getChannelId = async channelName => {
    const result = await webClient.conversations.list();
    if (!result || !result.ok) {
        throw new InternalServerError(
            "Slack client is not answered! Repeat request later."
        );
    }

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
    const { build_name, build_event, build_result } = buildInfo;

    const result = await webClient.conversations.setTopic({
        channel,
        topic: `${icon} ${build_name} on ${build_event}: ${build_result}`,
    });

    if (!(result && result.ok)) {
        throw new InternalServerError(
            "Topic hasn't been set! Repeat request later."
        );
    }
};
