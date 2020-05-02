import channelBuilds from "./channel-build.json";
import { NotFoundError } from "../../../errors";
import { saveToFile } from "../utilities";
import path from "path";

const nameOfFile = path.resolve(__dirname, "./channel-build.json");

export const addChannelBuild = async (channel, build) => {
    channelBuilds.push({
        channel,
        build,
    });
};

export const save = async () => {
    await saveToFile(nameOfFile, channelBuilds);
};

export const getChannelByBuildId = async buildId => {
    const desiredObject = channelBuilds.find(
        element => element.build === buildId
    );
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