export default (result, event) => {
    let icon;

    const isRun = /running/.test(result);
    if (isRun) {
        icon = `${String.fromCodePoint(0x1f6d1)}`;
    } else {
        const isFinishSuccess = /success/.test(result)
            && /buildFinished/.test(event);
        if (isFinishSuccess) {
            icon = `${String.fromCodePoint(0x2714)}`;
        } else {
            const isFailure = /failure/.test(result);
            icon = isFailure ? `${String.fromCodePoint(0x2757)}`
                : `${String.fromCodePoint(0x2753)}`;
        }
    }

    return icon;
};