import { getChannelByBuildId } from "../services/storage";
import { setTopic } from "../services/slack";
import getBuildNameFromUrl from "../utilities/getBuildNameFromUrl";

export default async (req, res) => {
    const buildInfo = req.body;

    const buildId = getBuildNameFromUrl(buildInfo.build_status_url);
    const channelName = await getChannelByBuildId(buildId);

    await setTopic(buildInfo, channelName);

    console.log("Topic was set");
    await res.sendStatus(200);
};