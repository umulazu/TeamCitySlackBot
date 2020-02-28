import { body } from "express-validator";
import getBuildNameFromUrl from "./getBuildNameFromUrl";
import HttpError from "../../helpers/HttpError";

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
            const build_id = getBuildNameFromUrl(url);
            if (!build_id) {
                throw new HttpError(400, "Please, check build's name!");
            }

            return build_id;
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