import { validationResult } from "express-validator";
import HttpError from "../../helpers/HttpError";

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};

export const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new HttpError(400, firstError);
    }

    next();
};