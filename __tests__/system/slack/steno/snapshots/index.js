import path from "path";
import snapshots from "./snapshots.json";
import { saveToFile } from "../../../../../src/services/storage/utilities";

export const getSnapshotByScenarioName = async scenarioName =>
    snapshots.find(snapshot => snapshot.scenario === scenarioName);

export const getAllSnapshots = () => snapshots;

export const createSnapshot = async (scenarioName, scenarioDescription) => {
    return {
        scenario: scenarioName,
        scenarioDescription,
        botApiMessages: [],
    };
};

export const addSnapshot = async snapshot => {
    snapshots.push(snapshot);
};

export const updateSnapshot = async (snapshot, request, response) => {
    const { timestamp } = request;

    const requestResponse = await getMessageByRequestTimestamp(
        snapshot,
        timestamp
    );

    if (requestResponse) {
        requestResponse.request = request;
        requestResponse.response = response;
    } else {
        const newRequestResponse = {
            request,
            response,
        };

        snapshot.botApiMessages.push(newRequestResponse);
    }
};

const getMessageByRequestTimestamp = async (snapshot, timestamp) =>
    snapshot.botApiMessages.find(
        requestResponse => requestResponse.request.timestamp === timestamp
    );

export const save = async () => {
    const nameOfFile = path.resolve(__dirname, "./snapshots.json");

    await saveToFile(nameOfFile, snapshots);
};
