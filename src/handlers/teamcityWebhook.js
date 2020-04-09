import { getChannelByBuildId } from "../services/storage/channelBuild";
import { setTopic } from "../services/slack";
import getBuildNameFromUrl from "../utilities/getBuildNameFromUrl";
import { saveFailureBuild, willTopicSet } from "../services/storage/closedChannels";

export default async (req, res) => {
    const buildInfo = req.body;

    const buildId = getBuildNameFromUrl(buildInfo.build_status_url);
    const channelName = await getChannelByBuildId(buildId);

    const result = await willTopicSet(channelName, buildId, isSuccess(buildInfo.build_result));
    if (result) {
        await setTopic(buildInfo, channelName);
        console.log("Topic was set");
    } else {
        console.log("Topic doesn't need to be refreshed");
    }

    if (isFailure(buildInfo.build_result)) {
        await saveFailureBuild(channelName, buildId);
    }

    await res.sendStatus(200);
};

const isSuccess = (buildResult) => /success/.test(buildResult);
const isFailure = (buildResult) => /failure/.test(buildResult);