import removeOldScenarios from "./removeOldScenarios";
import child_process from "child_process";
import path from "path";
import forgeToken from "./forgeToken";

export default async (scenarioName, isCreateMode) => {
    await removeOldScenarios(scenarioName);

    const workProcess = await child_process.spawn(
        "steno",
        [
            "record",
            `localhost:${process.env.PORT}`,
            "--scenario-name",
            `${scenarioName}`,
            "--slack-replace-tokens",
        ],
        {
            cwd: path.join(__dirname, "../"),
            detached: isCreateMode,
            shell: isCreateMode,
            stdio: ["inherit", "inherit", "inherit"],
        }
    );

    workProcess.on("close", async code => {
        try {
            console.log("Child process exited with exit code " + code);

            await forgeToken(scenarioName);
        } catch (e) {
            console.error(e);
        }
    });

    return workProcess;
};
