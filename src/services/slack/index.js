import getIcon from "./getIcon";
import { getChannelId, setTopicToChannel } from "./slackApi";

export const setTopic = async (buildInfo, channelName) => {
    const { build_event, build_result } = buildInfo;

    const channel = await getChannelId(channelName);

    const icon = getIcon(build_result, build_event);

    await setTopicToChannel(channel, buildInfo, icon);
};