import errorCodes from "./errorCodes.json";

export default async (err, req, res, next) => {
    console.error(err);

    if (err instanceof Error) {
        const desiredCode = errorCodes[err.name];

        await res.status(desiredCode || 500).send(err.message);
    } else {
        await res.status(500).send(err.toString());
    }
};