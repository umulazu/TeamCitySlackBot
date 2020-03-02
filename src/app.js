import express from "express";
import { getChannelByBuildId, saveToStorage } from "./services/storage/Storage";
import { validationErrorHandler } from "./middlewares/requestValidator/RequestValidator";
import { setTopic } from "./services/slack/Slack";
import {
    addBuildToChannelValidation,
    teamcityWebhookValidation,
} from "./middlewares/requestValidator/validators";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.post("/add_build_to_channel", addBuildToChannelValidation, validationErrorHandler);
app.post("/add_build_to_channel", async (req, res, next) => {
    try {
        const { buildName, channelName } = req.body;

        await saveToStorage(channelName, buildName);

        await res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

app.post("/teamcity_webhook", teamcityWebhookValidation, validationErrorHandler);
app.post("/teamcity_webhook", async (req, res, next) => {
    try {
        const buildInfo = req.body;

        const channelName = await getChannelByBuildId(
            buildInfo["build_status_url"]
        );

        await setTopic(buildInfo, channelName);

        console.log("Topic was set");
        await res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

app.use(errorHandler);

export default app;