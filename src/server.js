import { WebClient } from "@slack/web-api";
import express from "express";
import "dotenv/config";
import getIcon from "./utilities/getIcon";
import getBuildNameFromUrl from "./utilities/getBuildNameFromUrl";
import isObjectEmpty from "./utilities/isObjectEmpty";
import {
    saveToStorage,
    getChannelByBuildId,
} from "./services/storage/storage.js";
import getChannelId from "./services/slack/getChannelId";
import setTopic from "./services/slack/setTopic";

const app = express();
app.use(express.json());

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

app.get("/test", function(req, res) {
    res.send("Hello World!");
});

// todo: ! may be this method should be invoked from SLACK?
app.post("/add_build_to_channel", async (req, res) => {
    const fields = req.body;
    if (isObjectEmpty(fields)) {
        await res.status(400).send("Request body is empty!");
        return;
    }

    const { buildName, channelName } = fields;
    if (!(buildName && channelName)) {
        await res.status(400).send("Wrong format!");
        return;
    }

    const isSaved = await saveToStorage(channelName, buildName);
    if (!isSaved) {
        await res
            .status(500)
            .send("Error occurs when writing in file. Please, repeat request.");
        return;
    }

    await res.sendStatus(200);
});

app.post("/teamcity_webhook", async (req, res) => {
    const fields = req.body;
    if (isObjectEmpty(fields)) {
        console.error("Empty body!");
        res.sendStatus(400);
        return;
    }

    const { build_name, build_result, build_event, build_status_url } = fields;
    if (!(build_name && build_result && build_event && build_status_url)) {
        console.error("Wrong webhook format!");
        res.sendStatus(400);
        return;
    }

    const build_id = getBuildNameFromUrl(build_status_url);
    if (!build_id) {
        console.error("Please, check build's name");
        res.sendStatus(400);
        return;
    }

    const channel_name = await getChannelByBuildId(build_id);
    if (!channel_name) {
        console.error("Please, check build's and channel's names");
        res.sendStatus(404);
        return;
    }

    const channel = await getChannelId(webClient, channel_name);
    if (!channel) {
        console.error("Please, check for channel name's updates");
        res.sendStatus(404);
        return;
    }

    const icon = getIcon(build_result, build_event);

    const topicArguments = {
        channel,
        build_name,
        build_event,
        build_result,
        icon,
    };
    const isSet = await setTopic(webClient, topicArguments);
    if (!isSet) {
        console.error("Topic hasn't been set! Repeat request later.");
        res.sendStatus(500);
        return;
    }

    console.log("Message posted!");
    res.sendStatus(200);
});

const PORT = 9000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Node.js server started on port ${process.env.PORT || PORT}.`);
});
