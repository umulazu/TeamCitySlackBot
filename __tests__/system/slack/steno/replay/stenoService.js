import axios from "axios";

const stenoControlPort = process.env.STENO_CONTROL_PORT;

export const startReplayForScenario = async scenario => {
    const result = await axios.post(
        `http://localhost:${stenoControlPort}/start`,
        {
            name: scenario,
        }
    );

    if (result.error) {
        throw new Error(result.error.description);
    }

    return result;
};

export const stopReplay = async () => {
    const result = await axios.post(
        `http://localhost:${stenoControlPort}/stop`
    );

    if (result.error) {
        throw new Error(result.error.description);
    }

    return result;
};
