import { saveChannelBuild } from "../services/storage/";

export default async (req, res) => {
    const { buildName, channelName } = req.body;

    await saveChannelBuild(channelName, buildName);

    await res.sendStatus(200);
}