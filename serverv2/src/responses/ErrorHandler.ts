import Unauthorized from './clientErrors/Unauthorized';
import BadRequest from './clientErrors/BadRequest';
import NotFound from './clientErrors/NotFound';
import UnprocessableEntity from './clientErrors/UnprocessableEntity';
import InternalServerError from './serverErrors/InternalServerError';

import { ICustomErrorResponse } from "../common/interfaces/responses";
import { Request, Response, NextFunction } from "express";


export const errorHandlingWrapper = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export const errorHandler = (err: Error | ICustomErrorResponse, req: Request, res: Response, next: NextFunction) => {

    if (
        err instanceof Unauthorized ||
        err instanceof BadRequest ||
        err instanceof NotFound ||
        err instanceof Unauthorized ||
        err instanceof UnprocessableEntity ||
        err instanceof InternalServerError
    ) {
        return reportCustomError(err, res);
    }
    console.error(err)
    return res.status(500).json({"error":"Internal Server Error", "message": "Something went wrong. Please try again later."});
}

const reportCustomError = (err: ICustomErrorResponse, res: Response) => {

    const { statusCode = 500 } = err;
    return res.status(statusCode).json(err);
}