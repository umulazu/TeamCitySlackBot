import { statuses, statusIconMap } from "./mapper";

export default (result, event, previousResult) => {
    let icon;

    const isFailure = /failure/.test(result) && statuses.isFailure;
    const isRun = /running/.test(result) && statuses.isRun;
    const isInterrupted = /buildInterrupted/.test(event) && statuses.isInterrupted;
    const isPreviousSuccess = isInterrupted ? /success/.test(previousResult) && statuses.isPreviousSuccess : false;
    const isSuccess = /success/.test(result) && statuses.isSuccess;

    const concatStatuses = isFailure | isRun | isInterrupted | isPreviousSuccess | isSuccess;
    icon = statusIconMap[concatStatuses];

    return icon;
};