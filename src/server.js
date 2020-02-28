import "dotenv/config";
import app from "./app.js";

const PORT = 9000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Node.js server started on port ${process.env.PORT || PORT}.`);
});