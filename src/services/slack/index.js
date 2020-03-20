import getIcon from "./getIcon";
import { InternalServerError, NotFoundError } from "../../errors";
import { getChannelId, setTopicToChannel } from "./slackApi";

export const setTopic = async (buildInfo, channelName) => {
    const { build_event, build_result } = buildInfo;

    const channel = await getChannelId(channelName);
    if (!channel) {
        throw new NotFoundError("Please, check for channel name's updates");
    }

    const icon = getIcon(build_result, build_event);

    const isSet = await setTopicToChannel(channel, buildInfo, icon);
    if (!isSet) {
        throw new InternalServerError("Topic hasn't been set! Repeat request later.");
    }
};