import closedChannels from "./closed-channels";
import { saveToFile } from "./utilities";

const nameOfFile = "./src/services/storage/closed-channels.json";

export const getClosedChannel = channelName => {
    return closedChannels.find(element => element.channelName === channelName);
};

export const isBuildFailed = (channel, buildId) => {
    return channel.builds.includes(buildId);
};

export const deleteBuildId = (channel, buildId) => {
    const index = channel.builds.indexOf(buildId);
    if (index > -1) {
        return channel.builds.splice(index, 1);
    }
};

export const openChannel = async channel => {
    const length = channel.builds.length;
    if (length === 0) {
        const index = closedChannels.indexOf(channel);
        if (index > -1) {
            return closedChannels.splice(index, 1);
        }
    }
};

// all previous methods move to closedChannelsAPI

// 2 main exported methods:
export const willTopicSet = async (channelName, buildId, isSuccess) => {
    const closedChannel = getClosedChannel(channelName);
    if (closedChannel) {
        if (isBuildFailed(closedChannel, buildId) && isSuccess) {
            deleteBuildId(closedChannel, buildId);

            const isChannelOpen = await openChannel(closedChannel);

            await saveToFile(nameOfFile, closedChannels);

            return isChannelOpen;
        }
    } else {
        return true;
    }
};

export const saveFailureBuild = async (channelName, buildId) => {
    const closedChannel = getClosedChannel(channelName);
    if (closedChannel) {
        if (isBuildFailed(closedChannel, buildId)) {
            return;
        } else {
            closedChannel.builds.push(buildId);
        }
    } else {
        closedChannels.push({
            channelName,
            builds: [buildId],
        });
    }

    await saveToFile(nameOfFile, closedChannels);
};