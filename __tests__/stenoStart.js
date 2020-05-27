import removeOldScenarios from "./removeOldScenarios";

require("dotenv").config();
import path from "path";
import child_process from "child_process";
import getScenarioName from "./getScenarioName";
import forgeToken from "./forgeToken";

(async () => {
    try {
        const mode = process.argv[2] ? process.argv[2] : "replay";

        if (mode === "replay") {
            child_process.spawn("steno", ["replay", `localhost:${process.env.PORT}`], {
                cwd: path.join(__dirname, "integration"),
                stdio: "inherit",
            });
        } else {
            if (mode === "record") {
                let scenarioName = process.argv[3];

                if (!scenarioName) {
                    scenarioName = getScenarioName();
                }

                await removeOldScenarios(scenarioName);

                const workProcess = child_process.spawn(
                    "steno",
                    [
                        "record",
                        `localhost:${process.env.PORT}`,
                        "--scenario-name",
                        `${scenarioName}`,
                        "--slack-replace-tokens",
                    ],
                    {
                        cwd: path.join(__dirname, "integration"),
                        shell: true,
                        detached: true,
                        // stdio: "inherit",
                        stdio: ['inherit', 'inherit', 'inherit'],
                    }
                );

                // есть некоторые таймаут, когда steno продолжает занимать порт 3000

                // todo: попробовать отлавливать SIGINT в  workProcess.stdin.on('data', ...
                workProcess.stdin.on('data', (code) =>
                {
                    console.log(`The code is = ${code}`);
                    console.log('parent received sigint');
                });

                workProcess.on("close", async code => {
                    console.log("Child process exited with exit code " + code);

                    // should forge scenario's token=process.env.FAKE_BOR_TOKEN:
                    await forgeToken(scenarioName);

                    //  AND create or update same scenario in snapshots.json:


                });
                // workProcess.on("exit", async code => {
                //     console.log("Child process exited with exit code " + code);
                //
                //     await forgeToken(scenarioName);
                //     // should forge scenario's token=process.env.FAKE_BOR_TOKEN  AND create or update same scenario in snapshots.json
                //
                // });
                // workProcess.on("error", async code => {
                //     console.log("Child process exited with exit code " + code);
                //
                //     await forgeToken(scenarioName);
                //     // should forge scenario's token=process.env.FAKE_BOR_TOKEN  AND create or update same scenario in snapshots.json
                //
                // });

            }
        }
    } catch (e) {
        console.error(e);

    }

})();
