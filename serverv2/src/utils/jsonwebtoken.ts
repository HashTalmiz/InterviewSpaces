import { verify, TokenExpiredError } from "jsonwebtoken";
import { VerifyTokenStatus } from "../common/constants";
import { IDecodedToken } from "../common/interfaces/auth";

const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

export const verifyTokenSignature = (accessToken: string): { status: VerifyTokenStatus, decodedToken?: IDecodedToken } => {

    if (accessToken === undefined || accessToken === null) {
        return { status: VerifyTokenStatus.ACCESS_TOKEN_NOTFOUND };
    }

    try {
        const decodedToken = verify(accessToken, SECRET_KEY, { algorithms: ["HS256"] }) as IDecodedToken;
        return { status: VerifyTokenStatus.SUCCESS, decodedToken };
    }
    catch (err) {
        if (err instanceof TokenExpiredError) {
            return { status: VerifyTokenStatus.TOKEN_EXPIRED };
        }

        return { status: VerifyTokenStatus.SIGNATURE_VERIFICATION_FAILURE };
    }

}