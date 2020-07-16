const readlineSync = require("readline-sync");

export default () => {
    let scenarioDescription;
    while (true) {
        scenarioDescription = readlineSync.question("Input description of scenario: ");

        if (scenarioDescription) {
            break;
        }
    }

    return scenarioDescription;
};
