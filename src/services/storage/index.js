import * as channelBuildStorage from "./channelBuild";
import * as closedChannelStorage from "./closedChannels";

export const saveChannelBuild = async (channel, build) => {
    const isAlreadyExist = await channelBuildStorage.isExist(channel, build);
    if (isAlreadyExist) {
        console.log("Such element already exist!");
        return;
    }

    await channelBuildStorage.addChannelBuild(channel, build);

    await channelBuildStorage.save();
};

export const getChannelByBuildId = async buildId =>
    await channelBuildStorage.getChannelByBuildId(buildId);

export const willTopicSet = async (channelName, buildId, isSuccess) => {
    const closedChannel = closedChannelStorage.getClosedChannel(channelName);
    if (closedChannel) {
        if (
            closedChannelStorage.isBuildFailed(closedChannel, buildId) &&
            isSuccess
        ) {
            closedChannelStorage.deleteBuildId(closedChannel, buildId);

            const isChannelOpen = await closedChannelStorage.openChannel(
                closedChannel
            );

            await closedChannelStorage.save();

            return isChannelOpen;
        }
    } else {
        return true;
    }
};

export const saveFailureBuild = async (channelName, buildId) => {
    const closedChannel = closedChannelStorage.getClosedChannel(channelName);
    if (closedChannel) {
        if (closedChannelStorage.isBuildFailed(closedChannel, buildId)) {
            return;
        } else {
            closedChannel.builds.push(buildId);
        }
    } else {
        await closedChannelStorage.closeChannel(channelName, buildId);
    }

    await closedChannelStorage.save();
};