import icons from "./icons";

export default (result, event, previousResult) => {
    let icon;
    
// todo: restructure:
    const isFailure = /failure/.test(result);
    if (isFailure) {
        icon = icons.stopMark;
    } else {
        const isRun = /running/.test(result);
        if (isRun) {
            const isInterrupted = /buildInterrupted/.test(event);
            if (isInterrupted) {
                const isPreviousSuccess = /success/.test(previousResult);
                icon = isPreviousSuccess ? icons.checkMark : icons.stopMark;
            } else {
                icon = icons.stopMark;
            }
        } else {
            const isSuccess = /success/.test(result);
            icon = isSuccess ? icons.checkMark : icons.questionMark;
        }
    }

    // const isRun = /running/.test(result);
    // if (isRun) {
    //     icon = icons.stopMark;
    // } else {
    //     const isFinishSuccess =
    //         /success/.test(result) && /buildFinished/.test(event);
    //     if (isFinishSuccess) {
    //         icon = icons.checkMark;
    //     } else {
    //         const isFailure = /failure/.test(result);
    //         icon = isFailure
    //             ? icons.exclamationMark
    //             : icons.questionMark;
    //     }
    // }

    return icon;
};