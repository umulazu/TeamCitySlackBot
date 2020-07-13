const readlineSync = require("readline-sync");

export default () => {
    let scenarioName;
    while (true) {
        scenarioName = readlineSync.question("Input name of scenario: ");

        if (scenarioName) {
            break;
        }
    }

    return scenarioName;
};
