import errorHandler from "../../../src/middlewares/errorHandler";
import { NotFoundError } from "../../../src/errors";

describe("errorHandler", () => {
    console.error = jest.fn();

    const mockResponse = () => {
        const res = {};
        res.locals = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    it("should send response with 500 status code and error.message", async () => {
        const err = new Error("some error");
        const req = {};
        const res = mockResponse();

        await errorHandler(err, req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.send).toHaveBeenCalledWith(err.message);
    });

    it("should send response with custom status code", async () => {
        const err = new NotFoundError("some error");
        const req = {};
        const res = mockResponse();

        await errorHandler(err, req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.send).toHaveBeenCalledWith(err.message);
    });

    it("should send response with 500 status code and err by itself", async () => {
        const err = "some error";
        const req = {};
        const res = mockResponse();

        await errorHandler(err, req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.send).toHaveBeenCalledWith(err.toString());
    });
});
