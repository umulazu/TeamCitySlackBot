import { promises as fs } from "fs";
import { InternalServerError } from "../../errors";
import path from "path";

export const saveToFile = async (nameOfFile, jsonSerializable, encoding) => {
    try {
        const stringifiedData = JSON.stringify(jsonSerializable);
        if (encoding) {
            await fs.writeFile(nameOfFile, stringifiedData, encoding);
        } else {
            await fs.writeFile(nameOfFile, stringifiedData);
        }

        const storageName = path.basename(nameOfFile);
        console.log(`${storageName} has been updated.`);
    } catch (err) {
        throw new InternalServerError("Error occurred when writing in file.");
    }
};