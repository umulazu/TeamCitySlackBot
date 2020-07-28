import { BadRequestError, NotFoundError } from "../errors";
import * as messageLogger from "./messageLogger";

export default async (err, req, res, next) => {
    console.error(err);

    let status, text;
    const type = err.constructor;
    switch (type) {
        case BadRequestError: {
            status = 400;
            text = err.message;

            break;
        }
        case NotFoundError: {
            status = 404;
            text = err.message;

            break;
        }

        default: {
            status = 500;
            text = err.message || err.toString();
        }
    }

    await res.status(status).send(text);

    if (process.env.NODE_ENV === "test_record") {
        res.locals.text = text;

        await messageLogger.log(req, res);
    }
};