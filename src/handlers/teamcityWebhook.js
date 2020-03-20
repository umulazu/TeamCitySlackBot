import { getChannelByBuildId } from "../services/storage";
import { setTopic } from "../services/slack";

export default async (req, res) => {
    const buildInfo = req.body;

    const channelName = await getChannelByBuildId(
        buildInfo["build_status_url"]
    );

    await setTopic(buildInfo, channelName);

    console.log("Topic was set");
    await res.sendStatus(200);
}