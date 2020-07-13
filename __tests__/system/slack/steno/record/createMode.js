import * as child_process from "child_process";
import getScenarioName from "./getScenarioName";
import recordScenario from "./recordScenario";
import { config } from "dotenv";
config();

export default async () => {
    const scenarioName = getScenarioName();
//todo: here get test case description

    process.env.SCENARIO = scenarioName;
    process.env.NODE_ENV = "test_record";

    await child_process.fork("./index.js");

    const isCreateMode = true;
    await recordScenario(scenarioName, isCreateMode);
};
