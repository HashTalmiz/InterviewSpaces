// @ts-ignore
import * as bcrypt from 'bcrypt';
import {ILoginIn, IUser} from '../../../common/interfaces/auth';

import {User} from './User';
import {Token} from './Token';
import UnprocessableEntity from "../../../responses/clientErrors/UnprocessableEntity";
import {ErrorCode, ErrorDescription, VerifyTokenStatus} from "../../../common/constants";
import Unauthorized from "../../../responses/clientErrors/Unauthorized";
import Conflict from "../../../responses/clientErrors/Conflict";

/**
 * Class to abstract the higher level authentication logic away from
 * specific user actions
 */
class Authentication {
    constructor() {}

    async createUser({ firstName, lastName, email, password }: Partial<IUser>) {
        if (!email || !firstName || !lastName || !password) {
            throw new UnprocessableEntity(
                ErrorCode.INVALID_INPUT,
                ErrorDescription.INVALID_INPUT,
                'You must send all signup details.'
            );
        }

        const user = new User(firstName, lastName, email);

        const userExists = await User.doesUserExist(email);
        if (userExists) {
            throw new Conflict(
                ErrorCode.CONFLICT,
                ErrorDescription.CONFLICT,
                'User already exists.'
            );
        }

        user.setHashedPassword(this.hashPassword(password));
        return await user.saveUser();
    }

    async loginUser({ email, password }: ILoginIn): Promise<IUser> {
        if (!email || !password) {
            throw new UnprocessableEntity(
                ErrorCode.INVALID_INPUT,
                ErrorDescription.INVALID_INPUT,
                'You must send all login details.'
            );
        }

        const token = new Token();

        const userExists = await User.doesUserExist(email);
        if (!userExists) {
            throw new Unauthorized(
                ErrorCode.UNAUTHORIZED,
                ErrorDescription.UNAUTHORIZED,
                'User does not exist.'
            );
        }

        try {
            await this.compareHashedPassword(password, userExists.password);
        } catch (e) {
            throw new Unauthorized(
                ErrorCode.UNAUTHORIZED,
                ErrorDescription.UNAUTHORIZED,
                'Incorrect credentials.' + e,
            );
        }

        token.createToken(userExists);
        await token.createRefreshToken(userExists.email);

        // await this.logUserActivity(userExists.id, 'login');
        return {
            id: userExists.id,
            authToken: token.token,
            refreshToken: token.refreshToken,
            firstName: userExists.firstName,
            lastName: userExists.lastName,
            email: userExists.email
        };
    }

    private hashPassword(password: string) {
        return password && bcrypt.hashSync(password.trim(), 12);
    }

    private compareHashedPassword(password: string, hashedPassword: string) {
        return new Promise((res, rej) => {
            bcrypt.compare(password, hashedPassword, (err: Error | undefined, success: boolean) => {
                if (err) {
                    rej(new Error('The has been an unexpected error, please try again later'));
                }
                if (!success) {
                    rej(new Error('Your password is incorrect.'));
                } else {
                    res();
                }
            });
        });
    }

    logUserActivity(userId: number, activity: string) {
    }

    async validateToken(tokenToCheck: string) {
        const token = new Token(tokenToCheck);
        const verifyOutcome: VerifyTokenStatus = token.verifyTokenSignature();
        switch (verifyOutcome) {
            case VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE:
                throw new Unauthorized(
                    VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE,
                    ErrorDescription.UNAUTHORIZED,
                    "signature verification failed"
                );

            case VerifyTokenStatus.TOKEN_EXPIRED:
                throw new Unauthorized(
                    VerifyTokenStatus.TOKEN_EXPIRED,
                    ErrorDescription.UNAUTHORIZED,
                    "access token expired"
                );

            case VerifyTokenStatus.SUCCESS:
                break;
            default:
                throw new Unauthorized(
                    ErrorCode.SERVER_EXCEPTION,
                    ErrorDescription.UNAUTHORIZED,
                    "access token expired"
                );
        }
        return token.decodeToken();
    }
}

export { Authentication };
