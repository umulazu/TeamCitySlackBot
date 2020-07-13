export const middleware = async (req, res, next) => {
    res.on("finish", async () => {
        if (process.env.NODE_ENV === "test_record") {
            await log(req, res);
        }
    });

    next();
};

export const log = async (req, res) => {
    try {
        // dynamic import because of snapshots.json could exist only in DEV version of project
        const snapshots = await import(
            "../../../__tests__/system/slack/steno/snapshots"
        );

        let { statusCode } = res;
        let text = res.locals.text;

        if (!text) {
            text = "OK";
            statusCode = 200;
        }

        const responseForSnapshot = {
            statusCode,
            text,
        };


        const scenarioName = req.body.scenario || process.env.SCENARIO;

        const requestForSnapshot = req.body;

        requestForSnapshot.scenario = scenarioName;

        const snapshot = await snapshots.getSnapshotByScenarioName(
            scenarioName
        );

        if (snapshot) {
            await snapshots.updateSnapshot(
                snapshot,
                requestForSnapshot,
                responseForSnapshot
            );
        } else {
            const snapshot = await snapshots.createSnapshot(
                scenarioName,
                requestForSnapshot,
                responseForSnapshot
            );

            await snapshots.addSnapshot(snapshot);
        }

        await snapshots.save();
    } catch (e) {
        console.error(e);
    }
};