import channelBuilds from "./channel-build.json";
import { NotFoundError } from "../../errors";
import { saveToFile } from "./utilities";

const nameOfFile = "./src/services/storage/channel-build.json";

export const saveToStorage = async (channel, build) => {
    const isAlreadyExist = await isExist(channel, build);
    if (isAlreadyExist) {
        console.log("Such element already exist!");
        return;
    }

    channelBuilds.push({
        channel,
        build,
    });

    await saveToFile(nameOfFile, channelBuilds);
};

export const getChannelByBuildId = async buildId => {
    const desiredObject = channelBuilds.find(element => element.build === buildId);
    if (!desiredObject) {
        throw new NotFoundError(
            `There is no ${buildId}. Please, check build's and channel's names`
        );
    }

    return desiredObject.channel;
};

export const isExist = async (channel, build) => {
    return channelBuilds.find(
        element => element.build === build && element.channel === channel
    );
};