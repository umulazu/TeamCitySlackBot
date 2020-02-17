import { promises as fs } from "fs";

const nameOfFile = "./services/storage/channel-build.json";
import storage from "./channel-build.json";

export const saveToStorage = async (channel, build) => {
    storage.push({
        channel,
        build,
    });

    try {
        const stringifiedData = JSON.stringify(storage);
        await fs.writeFile(nameOfFile, stringifiedData);
        console.log("Storage has been updated.");
        return true;
    } catch (err) {
        console.error(err);
    }
};

export const getChannelByBuildId = async buildId => {
    const desiredObject = storage.find(element => element["build"] === buildId);
    return desiredObject ? desiredObject.channel : null;
};
