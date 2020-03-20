import express from "express";
import { validationErrorHandler } from "./middlewares/requestValidator";
import {
    addBuildToChannelValidation,
    teamcityWebhookValidation,
} from "./middlewares/requestValidator/validators";
import errorHandler from "./middlewares/errorHandler";
import asyncHandler from "./middlewares/asyncHandler";
import addBuildToChannel from "./handlers/addBuildToChannel";
import teamcityWebhook from "./handlers/teamcityWebhook";

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.post(
    "/add-build-to-channel",
    addBuildToChannelValidation,
    validationErrorHandler,
    asyncHandler(addBuildToChannel)
);

app.post(
    "/teamcity-webhook",
    teamcityWebhookValidation,
    validationErrorHandler,
    asyncHandler(teamcityWebhook)
);

app.use(errorHandler);

export default app;