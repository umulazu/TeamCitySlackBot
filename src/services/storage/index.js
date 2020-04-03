import { promises as fs } from "fs";
import storage from "./channel-build.json";
import { InternalServerError, NotFoundError } from "../../errors";

const nameOfFile = "./src/services/storage/channel-build.json";

export const saveToStorage = async (channel, build) => {
    storage.push({
        channel,
        build,
    });

    try {
        const stringifiedData = JSON.stringify(storage);
        await fs.writeFile(nameOfFile, stringifiedData);
        console.log("Storage has been updated.");
    } catch (err) {
        throw new InternalServerError("Error occurred when writing in file.");
    }
};

export const getChannelByBuildId = async buildId => {
    const desiredObject = storage.find(element => element.build === buildId);
    if (!desiredObject) {
        throw new NotFoundError(
            `There is no ${buildId}. Please, check build's and channel's names`
        );
    }

    return desiredObject.channel;
};
