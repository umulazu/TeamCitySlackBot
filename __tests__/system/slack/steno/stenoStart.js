import { config } from "dotenv";
config();
import child_process from "child_process";
import recordMode from "./record/recordMode";

(async () => {
    try {
        const mode = process.argv[2] ? process.argv[2] : "replay";

        if (mode === "replay") {
            await child_process.spawn(
                "steno",
                ["replay", `localhost:${process.env.PORT}`],
                {
                    cwd: __dirname,
                    stdio: "inherit",
                }
            );
        } else {
            await recordMode();
        }
    } catch (e) {
        console.error(e);
    }
})();
