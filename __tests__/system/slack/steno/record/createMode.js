import * as child_process from "child_process";
import getScenarioName from "./getScenarioName";
import recordScenario from "./recordScenario";
import { config } from "dotenv";
import getScenarioDescription from "./getScenarioDescription";
import * as snapshots from "../snapshots";
config();

export default async () => {
    const scenarioName = getScenarioName();

    const scenarioDescription = getScenarioDescription();

    await createInitialSnapshot(scenarioName, scenarioDescription);

    process.env.SCENARIO = scenarioName;
    process.env.NODE_ENV = "test_record";

    await child_process.fork("./index.js");

    const isCreateMode = true;
    await recordScenario(scenarioName, isCreateMode);
};

const createInitialSnapshot = async (scenarioName, scenarioDescription) => {
    const snapshot = await snapshots.createSnapshot(
        scenarioName,
        scenarioDescription
    );

    await snapshots.addSnapshot(snapshot);

    await snapshots.save();
};
