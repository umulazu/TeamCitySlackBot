require("dotenv").config();
const path = require("path");
const cp = require("child_process");

const mode = process.argv[2] ? process.argv[2] : "replay";

if (mode === "replay") {
    cp.spawn("steno", ["replay", `localhost:${process.env.PORT}`], {
        cwd: path.join(__dirname, "integration"),
        stdio: "inherit",
    });
} else {
    cp.spawn(
        "steno",
        ["record", `localhost:${process.env.PORT}`, "--slack-replace-tokens"],
        {
            cwd: path.join(__dirname, "integration"),
            stdio: "inherit",
        }
    );
}
