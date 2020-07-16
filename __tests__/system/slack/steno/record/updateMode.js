import * as child_process from "child_process";
import recordScenario from "./recordScenario";
import { getAllSnapshots } from "../snapshots";
import * as snapshotMessages from "../replay/snapshotMessages";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

export default async () => {
    process.env.NODE_ENV = "test_record";

    const snapshots = await getAllSnapshots();

    for (const snapshot of snapshots) {
        await updateScenario(snapshot);
    }
};

const updateScenario = async snapshot => {
    process.env.SCENARIO = snapshot.scenario;

    const bot = await openApp();

    await invokeBotApi(snapshot);

    await closeApp(bot);
};

const openApp = async () => {
    const bot = child_process.fork("./index.js");

    await waitForServerToStartListen(bot);

    return bot;
};

const closeApp = async bot => {
    await bot.kill();
};

const invokeBotApi = async snapshot => {
    const scenarioName = snapshot.scenario;

    const isCreateMode = false;
    const scenarioRecordProcess = await recordScenario(
        scenarioName,
        isCreateMode
    );

    const requests = await snapshotMessages.getRequests(scenarioName);

    await makeRequests(requests);

    await scenarioRecordProcess.kill();
};

const makeRequests = async requests => {
    for (const request of requests) {
        await fetch(`http://localhost:${process.env.PORT}/teamcity-webhook`, {
            method: "post",
            body: JSON.stringify(request),
            headers: { "Content-Type": "application/json" },
        });

        await saveSnapshotsToFileTimeout(1000);
    }
};

const saveSnapshotsToFileTimeout = timeout =>
    new Promise(resolve => setTimeout(resolve, timeout));

const waitForServerToStartListen = bot =>
    new Promise(resolve => {
        bot.on("message", async () => {
            resolve();
        });
    });
