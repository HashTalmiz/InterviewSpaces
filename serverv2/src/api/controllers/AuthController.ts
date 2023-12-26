import {Authentication} from "../services/auth/Authentication";
import {NextFunction, Request, Response} from "express";
import {ICustomErrorResponse} from "../../common/interfaces/responses";
import {errorHandlingWrapper} from "../../responses/ErrorHandler";



export const loginController = errorHandlingWrapper(async (req: Request, res: Response) => {
    const authentication = new Authentication();
    const theUser = await authentication.loginUser({
        email: req.body.email,
        password: req.body.password
    });
    res.send({
        success: true,
        authToken: theUser.authToken,
        refreshToken: theUser.refreshToken,
        firstName: theUser.firstName,
        lastName: theUser.lastName,
        email: theUser.email
    })
});

export const registerController = errorHandlingWrapper( async (req: Request, res: Response) => {
    const auth = new Authentication();
        await auth.createUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        res.send({
            success: true,
            message: 'Thanks for registering! Please log in to continue.'
        });
});

export const validateToken = errorHandlingWrapper(async (req: Request, res: Response) => {
    const authentication = new Authentication();
        const decodedToken = await authentication.validateToken(req.body.token);
        res.send({
            success: true,
            decodedToken
        });
});
