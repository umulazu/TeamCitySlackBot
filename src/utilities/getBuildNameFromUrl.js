import { BadRequestError } from "../errors";

export default reqUrl => {
    if (!reqUrl) {
        throw new BadRequestError(
            "URL is empty! Please, check build_status_url."
        );
    }

    const urlObject = new URL(reqUrl);
    const buildNames = urlObject.searchParams.getAll("buildTypeId");
    if (!buildNames.length) {
        throw new BadRequestError(
            "There is no buildTypeId! Please, check build_status_url."
        );
    }

    if (buildNames.length > 1) {
        throw new BadRequestError(
            "There are too many buildTypeId's! Please, check build_status_url."
        );
    }

    if (!buildNames[0]) {
        throw new BadRequestError(
            "There is no buildTypeId value! Please, check build_status_url."
        );
    }

    return buildNames[0];
};
