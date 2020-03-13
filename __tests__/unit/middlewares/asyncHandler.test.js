import asyncHandler from "../../../src/middlewares/asyncHandler";

describe("asyncHandler", () => {
    it("shouldn't call the next function when passed function executed is OK", async () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        const passedFunction = jest.fn().mockResolvedValue();

        const handler = asyncHandler(passedFunction);

        await handler(req, res, next);

        expect(passedFunction).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it("should catch the rejected promise if an error occurred in the passed function", async () => {
        const err = new Error("some error");
        const req = {};
        const res = {};
        const next = jest.fn();
        const passedFunction = jest.fn().mockRejectedValue(err);

        const handler = asyncHandler(passedFunction);
        await handler(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
    });

    it("should call the next function if error occurred in passed function", async () => {
        const err = new Error("some error");
        const req = {};
        const res = {};
        const next = jest.fn();
        const passedFunction = jest.fn().mockImplementation(() => {
            throw err;
        });

        const handler = asyncHandler(passedFunction);

        expect(() => {
            handler(req, res, next);
            expect(next).toHaveBeenCalledWith(err);
        }).toThrow(err);
    });

    it("should catch the thrown errors from the passed function into the next function", async () => {
        const err = new Error("some error");
        const req = {};
        const res = {};
        const next = jest.fn();
        const passedFunction = jest.fn().mockImplementation(async () => {
            throw err;
        });

        const handler = asyncHandler(passedFunction);

        await handler(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});