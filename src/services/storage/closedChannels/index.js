import realClosedChannel from "./closed-channels";
import { saveToFile } from "../utilities";
import path from "path";

let closedChannels;
let nameOfFile;
switch (process.env.NODE_ENV) {
    case "test_record":
        closedChannels = [];
        nameOfFile = path.resolve(__dirname, "../../../../__tests__/integration/services/slack/fake-closed-channels.json");
        break;
    case "test":
        // will be mocked for emptying in every test:
        closedChannels = realClosedChannel;
        // stub for saving:
        nameOfFile = path.resolve(__dirname, "../../../../__tests__/integration/services/slack/fake-closed-channels.json");
        break;
    default:
        closedChannels = realClosedChannel;
        nameOfFile = path.resolve(__dirname, "./closed-channels.json");
}
// if (process.env.NODE_ENV === "test_record" || process.env.NODE_ENV === "test_replay") {
// if (process.env.NODE_ENV === "test_record") {
//     // in every scenario record storage will be empty:
//     closedChannels = [];
//     nameOfFile = path.resolve(__dirname, "../../../../__tests__/integration/services/slack/fake-closed-channels.json");
// } else {
//     closedChannels = realClosedChannel;
//     nameOfFile = path.resolve(__dirname, "./closed-channels.json");
// }

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

export const closeChannel = async (channelName, buildId) => {
    closedChannels.push({
        channelName,
        builds: [buildId],
    });
};

export const save = async () => {
    await saveToFile(nameOfFile, closedChannels);
};