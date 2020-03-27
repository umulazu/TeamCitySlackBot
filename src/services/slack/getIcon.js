import icons from "./icons";

export default (result, event) => {
    let icon;

    const isRun = /running/.test(result);
    if (isRun) {
        icon = icons.stopMark;
    } else {
        const isFinishSuccess =
            /success/.test(result) && /buildFinished/.test(event);
        if (isFinishSuccess) {
            icon = icons.checkMark;
        } else {
            const isFailure = /failure/.test(result);
            icon = isFailure
                ? icons.exclamationMark
                : icons.questionMark;
        }
    }

    return icon;
};
