import getIcon from "./getIcon";
import {
    deleteMessage,
    getChannelId,
    getTopicMessageTimestamp,
    setTopicToChannel,
} from "./slackApi";

export const setTopic = async (buildInfo, channelName) => {
    const { build_event, build_result, build_result_previous } = buildInfo;

    const channel = await getChannelId(channelName);

    const icon = getIcon(build_result, build_event, build_result_previous);

    const topicTimestamp = await setTopicToChannel(channel, buildInfo, icon);

    // todo: these methods aren't interconnected so they are separated.
    //  also this way is more comfortable for unit testing.
    //  BUT if we want also to send message when failure, it is going to be very verbose.
    const timestamp = await getTopicMessageTimestamp(channel, topicTimestamp);
    await deleteMessage(channel, timestamp);
};