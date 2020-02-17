import url from "url";

export default reqUrl => {
    try {
        const url_parts = url.parse(reqUrl, true);

        return url_parts ? url_parts.query["buildTypeId"] : null;
    } catch (error) {
        console.error(error);
    }
};
