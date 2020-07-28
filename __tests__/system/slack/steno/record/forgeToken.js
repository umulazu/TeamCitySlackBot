import { promises as fs } from "fs";
import path from "path";
import { saveToFile } from "../../../../../src/services/storage/utilities";

export default async scenarioName => {
    const scenarioDirectory = path.resolve(
        __dirname,
        `../scenarios/${scenarioName}`
    );

    const scenarioMethods = await getMethodsFromDirectory(scenarioDirectory);

    if (scenarioMethods && scenarioMethods.length) {
        for (const filename of scenarioMethods) {
            const scenarioMethodFile = path.resolve(
                scenarioDirectory,
                `./${filename}`
            );

            let scenarioMethod = await fs.readFile(scenarioMethodFile, "utf-8");

            const forgedScenarioMethod = scenarioMethod.replace(
                new RegExp('(token=)[^"&]+([&|"])'),
                `$1${process.env.FAKE_BOT_TOKEN}$2`
            );

            const base64ForgedScenarioMethod = Buffer.from(
                forgedScenarioMethod
            ).toString("base64");

            await saveToFile(
                scenarioMethodFile,
                base64ForgedScenarioMethod,
                "base64"
            );
        }
    } else {
        console.log("Scenario directory is empty. There is nothing to crypt.");
    }
};

const getMethodsFromDirectory = async scenarioDirectory => {
    try {
        return await fs.readdir(scenarioDirectory);
    } catch (e) {
        console.log("There is no steno scenarios. It didn't reach Slack.");
    }
};
