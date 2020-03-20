export class BadRequestError extends Error {
    constructor(message) {
        super();
        this.name = "BadRequestError";
        this.message = message;
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super();
        this.name = "NotFoundError";
        this.message = message;
    }
}

export class InternalServerError extends Error {
    constructor(message) {
        super();
        this.name = "InternalServerError";
        this.message = message;
    }
}

