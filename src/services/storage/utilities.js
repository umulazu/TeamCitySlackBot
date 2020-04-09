import { promises as fs } from "fs";
import { InternalServerError } from "../../errors";

export const saveToFile = async (nameOfFile, jsonSerializable) => {
    try {
        const stringifiedData = JSON.stringify(jsonSerializable);
        await fs.writeFile(nameOfFile, stringifiedData);
        console.log("Storage has been updated.");
    } catch (err) {
        throw new InternalServerError("Error occurred when writing in file.");
    }
};