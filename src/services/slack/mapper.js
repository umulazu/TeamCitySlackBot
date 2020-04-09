import icons from "./icons";

export const statuses = {
    isFailure: 1,
    isRun: 2,
    isInterrupted: 4,
    isPreviousSuccess: 8,
    isSuccess: 16
};

export const statusIconMap = {
    [statuses.isFailure]: icons.stopMark,
    [statuses.isRun | statuses.isInterrupted | statuses.isPreviousSuccess]: icons.checkMark,
    [statuses.isRun | statuses.isInterrupted]: icons.stopMark,
    [statuses.isRun]: icons.stopMark,
    [statuses.isSuccess]: icons.checkMark,
    [0]: icons.questionMark,
};