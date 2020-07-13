import { NotFoundError } from "../../../../../src/errors";
import { getSnapshotByScenarioName } from "../snapshots";

const getSnapshotMessages = async scenarioName => {
    const snapshot = await getSnapshotByScenarioName(scenarioName);

    if (!snapshot) {
        throw new NotFoundError(
            `There is no ${scenarioName} in snapshots.json. Check scenario name.`
        );
    }

    return snapshot.botApiMessages;
};

export const getRequests = async scenarioName => {
    const scenarioMessages = await getSnapshotMessages(scenarioName);

    return scenarioMessages.map(requestResponse => requestResponse.request);
};

export const getResponses = async scenarioName => {
    const scenarioMessages = await getSnapshotMessages(scenarioName);

    return scenarioMessages.map(requestResponse => requestResponse.response);
};
