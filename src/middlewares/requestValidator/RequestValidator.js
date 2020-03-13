import { validationResult } from "express-validator";
import { BadRequestError } from "../../helpers/errors";

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};

export const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new BadRequestError(firstError);
    }

    next();
};