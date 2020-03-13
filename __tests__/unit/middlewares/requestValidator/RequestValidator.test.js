import { validationErrorHandler } from "../../../../src/middlewares/requestValidator/RequestValidator";
import { validationResult } from "express-validator";

jest.mock("express-validator");

describe("RequestValidatorMiddleware", () => {
    it("should throw HttpError", () => {
        const isErrorOccurred = true;

        validationResult.mockImplementation(() => ({
            formatWith: () => ({
                isEmpty: () => !isErrorOccurred,
                array: () => [],
            }),
        }));

        const next = jest.fn();

        expect(() => {
            validationErrorHandler(null, null, next);
        }).toThrowError();

        expect(next).not.toHaveBeenCalled();
    });

    it("shouldn't throw HttpError", () => {
        const isErrorOccurred = false;

        validationResult.mockImplementation(() => ({
            formatWith: () => ({
                isEmpty: () => !isErrorOccurred,
                array: () => [],
            }),
        }));

        const next = jest.fn();

        expect(() => {
            validationErrorHandler(null, null, next);
        }).not.toThrowError();

        expect(next).toHaveBeenCalled();
    });
});