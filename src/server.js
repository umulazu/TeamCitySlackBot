import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Node.js server started on port ${PORT}.`);

    if (process.env.NODE_ENV === "test_record") {
        process.send(`Node.js server started on port ${PORT}.`);
    }
});