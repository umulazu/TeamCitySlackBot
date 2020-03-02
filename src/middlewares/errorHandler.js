export default async (err, req, res, next) => {
    if (err instanceof Error) {
        console.error(err.message);

        await res.status(err.statusCode || 500).send(err.message);
    } else {
        console.error(err);
        await res.status(500).send(err.toString());
    }
};