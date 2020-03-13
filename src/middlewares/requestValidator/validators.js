import { body } from "express-validator";
import getBuildNameFromUrl from "./getBuildNameFromUrl";
import { BadRequestError } from "../../helpers/errors";

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
        .customSanitizer(url => {
            const buildId = getBuildNameFromUrl(url);
            if (!buildId) {
                throw new BadRequestError("Please, check build's name!");
            }

            return buildId;
        }),
];

export const addBuildToChannelValidation = [
    body([
        "buildName",
        "channelName"
    ]).exists({
        checkFalsy: true
    }),
];