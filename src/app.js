import express from "express";
import { getChannelByBuildId, saveToStorage } from "./services/storage/Storage";
import { validationErrorHandler } from "./middlewares/requestValidator/RequestValidator";
import { setTopic } from "./services/slack/slack";
import {
    addBuildToChannelValidation,
    teamcityWebhookValidation,
} from "./middlewares/requestValidator/validators";
import errorHandler from "./middlewares/errorHandler/errorHandler";
import asyncHandler from "./middlewares/asyncHandler";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.post(
    "/add-build-to-channel",
    addBuildToChannelValidation,
    validationErrorHandler,
    asyncHandler(async (req, res, next) => {
        const { buildName, channelName } = req.body;

        await saveToStorage(channelName, buildName);

        await res.sendStatus(200);
    })
);

app.post(
    "/teamcity-webhook",
    teamcityWebhookValidation,
    validationErrorHandler,
    asyncHandler(async (req, res, next) => {
        const buildInfo = req.body;

        const channelName = await getChannelByBuildId(
            buildInfo["build_status_url"]
        );

        await setTopic(buildInfo, channelName);

        console.log("Topic was set");
        await res.sendStatus(200);
    })
);

app.use(errorHandler);

export default app;