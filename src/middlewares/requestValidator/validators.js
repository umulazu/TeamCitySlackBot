import { body } from "express-validator";

export const teamcityWebhookValidation = [
    body([
        "build_name",
        "build_result",
        "build_event"
    ]).exists({
        checkFalsy: true,
    }),
    body("build_status_url")
        .exists({ checkFalsy: true })
        .bail()
        .isURL()
];

export const addBuildToChannelValidation = [
    body([
        "buildName",
        "channelName"
    ]).exists({
        checkFalsy: true
    }),
];