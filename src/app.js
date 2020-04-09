import express from "express";
import { validationErrorMiddleware } from "./middlewares/requestValidator";
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
    validationErrorMiddleware,
    asyncHandler(addBuildToChannel)
);

app.post(
    "/teamcity-webhook",
    teamcityWebhookValidation,
    validationErrorMiddleware,
    asyncHandler(teamcityWebhook)
);

app.use(errorHandler);

export default app;