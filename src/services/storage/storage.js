import { promises as fs } from "fs";

const nameOfFile = "./src/services/storage/channel-build.json";
import storage from "./channel-build.json";
import HttpError from "../../helpers/HttpError";

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
        throw new HttpError(500, "Error occurred when writing in file.");
    }
};

export const getChannelByBuildId = async buildId => {
    const desiredObject = storage.find(element => element["build"] === buildId);
    if (!desiredObject) {
        throw new HttpError(404, "Please, check build's and channel's names");
    }

    return desiredObject.channel;
};
