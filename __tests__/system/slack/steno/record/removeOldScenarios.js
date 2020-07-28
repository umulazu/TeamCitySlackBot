import { promises as fs } from "fs";
import path from "path";

export default async scenarioName => {
    const scenarioDirectory = path.resolve(
        __dirname,
        `../scenarios/${scenarioName}`
    );

    try {
        await fs.access(scenarioDirectory);

        const filesFromDirectory = await fs.readdir(scenarioDirectory);

        if (filesFromDirectory && filesFromDirectory.length) {
            for (const file of filesFromDirectory) {
                await fs.unlink(path.join(scenarioDirectory, file));
            }
        }
    } catch (e) {
        console.log("There was no old steno scenario.");
    }
};
