import { promises as fs } from "fs";
import path from "path";

export const getSuccessMethods = interactions => {
    let successMethod = [];
    interactions.forEach(interaction => {
        const method = interaction.request.url;

        successMethod.push(method);
    });

    return successMethod;
};

export const getAllMethodsFromScenario = async scenarioName => {
    let apiMethods = [];

    const scenarioDirectory = path.resolve(
        __dirname,
        `../scenarios/${scenarioName}`
    );

    const scenarioMethods = await fs.readdir(scenarioDirectory);
    if (scenarioMethods && scenarioMethods.length) {
        for (const filename of scenarioMethods) {
            const scenarioMethodFile = path.resolve(
                scenarioDirectory,
                `./${filename}`
            );

            let scenarioMethod = await fs.readFile(scenarioMethodFile, "utf-8");

            const endpoint = /POST (\/.+\/.+) HTTP\/1\.1/.exec(scenarioMethod);
            if (endpoint && endpoint[1]) {
                const slackApiMethod = endpoint[1];

                apiMethods.push(slackApiMethod);
            } else {
                throw new Error("There is problem with first line format!");
            }
        }
    } else {
        console.log("Scenario directory is empty. There is nothing to crypt.");
    }

    return apiMethods;
};
