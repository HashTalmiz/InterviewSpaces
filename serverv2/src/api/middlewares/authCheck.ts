import Unauthorized from '../../responses/clientErrors/Unauthorized';
import { Request, Response, NextFunction } from 'express';
import { ErrorDescription } from "../../common/constants";
import { IDecodedToken } from '../../common/interfaces/auth';
import {Authentication} from "../services/auth/Authentication";

const AuthCheck = async (req: Request, res: Response, next: NextFunction) => {

    const { headers } = req;
    if (!headers.authorization) {
        throw new Unauthorized(
            "UNAUTHORIZED",
            ErrorDescription.UNAUTHORIZED,
            "access token is required"
        );
    }

    const accessToken: string = headers.authorization.replace('Bearer', '').trim();
    const auth = new Authentication();
    const decodedToken: IDecodedToken = await auth.validateToken(accessToken);

    if (decodedToken === null) {
        throw new Unauthorized(
            'INVALID_TOKEN_FORMAT',
            ErrorDescription.UNAUTHORIZED,
            'invalid token'
        );
    }

    // references: https://stackoverflow.com/questions/18875292/passing-variables-to-the-next-middleware-using-next-in-express-js
    res.locals.decodedToken = decodedToken;

    next();
}

export default AuthCheck;