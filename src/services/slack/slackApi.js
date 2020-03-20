import { WebClient } from "@slack/web-api";

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);
// possible variant 1:
// export const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export const getChannelId = async channelName => {
    // possible variant 2:
    // const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    const result = await webClient.conversations.list();
    if (!result || !result.ok) {
        return;
    }

    const listOfChannels = result.channels;

    const channel = listOfChannels.find(
        channel => channel.name === channelName
    );

    return channel && channel.id;
};

export const setTopicToChannel = async (channel, buildInfo, icon) => {
    const { build_name, build_event, build_result } = buildInfo;

    const result = await webClient.conversations.setTopic({
        channel,
        topic: `${icon} ${build_name} on ${build_event}: ${build_result}`,
    });

    return result && result.ok;
};
