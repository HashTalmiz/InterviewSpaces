import * as jwt from 'jsonwebtoken';
import db from '../../db/prisma';
import config from '../../../common/config';
import { IUser } from '../../../common/interfaces/auth';
import {VerifyTokenStatus} from "../../../common/constants";
import {IDecodedToken} from "../../../common/interfaces/auth";
import {TokenExpiredError, verify} from "jsonwebtoken";

class Token {
    public token: string;
    public refreshToken: string;

    constructor(token?: string, refreshToken?: string) {
        if (token) {
            this.token = token;
        }
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

    createToken(user: IUser) {
        const userCopy = { ...user };
        delete userCopy.password;
        this.token = jwt.sign(userCopy, config.authSecret, {
            expiresIn: '30m'
        });
    }

    async createRefreshToken(userEmail: string) {
        this.refreshToken = jwt.sign({ type: 'refresh' }, config.authSecret, {
            expiresIn: '2h' // 1 hour
        });

        await this.saveRefreshToken(userEmail);

        return;
    }

    private saveRefreshToken(userEmail: string) {
        return db.users.update({ refreshToken: this.refreshToken }, { where: { email: userEmail } });
    }

    validateRefreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new Error('There is no refresh token to check.');
        }

        return new Promise((res, rej) => {
            jwt.verify(refreshToken, config.authSecret, async (err: any) => {
                if (err) {
                    rej({
                        code: 'refreshExpired',
                        message: 'Refresh token expired - session ended.'
                    });
                } else {
                    try {
                        const user = await db.users.findOne({ raw: true, where: { refreshToken } });
                        res(user);
                    } catch (e) {
                        rej(e);
                    }
                }
            });
        });
    }

    verifyTokenSignature() {
        if (this.token === undefined || this.token === null) {
            return VerifyTokenStatus.ACCESS_TOKEN_NOTFOUND
        }

        try {
            verify(this.token, config.authSecret, { algorithms: ["RS256"] });
            return VerifyTokenStatus.SUCCESS;
        }
        catch (err) {
            if (err instanceof TokenExpiredError) {
                return VerifyTokenStatus.TOKEN_EXPIRED;
            }

            return VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE;
        }
    }

    decodeToken(): IDecodedToken {
        return jwt.decode(this.token) as IDecodedToken;
    }
}

export { Token };
