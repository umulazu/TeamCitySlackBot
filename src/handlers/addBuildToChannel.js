import { saveToStorage } from "../services/storage/channelBuild";

export default async (req, res) => {
    const { buildName, channelName } = req.body;

    await saveToStorage(channelName, buildName);

    await res.sendStatus(200);
}