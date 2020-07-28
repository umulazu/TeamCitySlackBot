import createMode from "./createMode";
import updateMode from "./updateMode";

export default async () => {
    try {
        const mode = process.argv[2] ? process.argv[2] : "create";

        if (mode === "update") {
            await updateMode();
        } else {
            if (mode === "create") {
                await createMode();
            } else {
                console.log("There is unknown mode!");
            }
        }
    } catch (e) {
        console.error(e);
    }
};
