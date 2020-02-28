import url from "url";

export default reqUrl => {
    try {
        const url_parts = url.parse(reqUrl, true);
        if (url_parts) {
            const buildName = url_parts.query["buildTypeId"];
            const isArray = Array.isArray(buildName);

            return isArray ? null : buildName;
        }
    } catch (error) {
        throw error;
    }
};