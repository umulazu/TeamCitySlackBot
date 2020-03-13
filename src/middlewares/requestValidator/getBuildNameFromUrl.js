import url from "url";

export default reqUrl => {
    const url_parts = url.parse(reqUrl, true);
    if (url_parts) {
        const buildName = url_parts.query["buildTypeId"];
        const isArray = Array.isArray(buildName);

        return isArray ? null : buildName;
    }
};