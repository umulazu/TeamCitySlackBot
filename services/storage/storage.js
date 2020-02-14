import fs from "fs";

const nameOfFile = "./services/storage/channel-build.json";
import storage from "./channel-build.json";

export const saveToStorage = async (channel, build) => {
    storage.push({
        channel,
        build,
    });

    try {
        const stringifiedData = JSON.stringify(storage);
        fs.writeFile(nameOfFile, stringifiedData, err => {
            if (err) {
                console.error(err);
                return;
            }

            console.log("Storage has been updated.");
        });
    } catch (err) {
        // todo: ! there is only JSON error catching
        //  should we return err, or just "-1"?
        console.error(err);
        return err;
    }
};

export const getChannelByBuildId = async (buildId) => {
    const desiredObject = storage.find((element) => element["build"] === buildId);
    return desiredObject ? desiredObject.channel : null;
};