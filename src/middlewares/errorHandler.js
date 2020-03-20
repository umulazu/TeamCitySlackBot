import { BadRequestError, NotFoundError } from "../errors";

export default async (err, req, res, next) => {
    console.error(err);

    switch (true) {
        case err instanceof BadRequestError: {
            await res.status(400).send(err.message);
            break;
        }
        case err instanceof NotFoundError: {
            await res.status(404).send(err.message);
            break;
        }

        default: {
            await res.status(500).send(err.message || err.toString());
        }
    }
};