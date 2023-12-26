import DB from '../../../db/DB';
import {IUser} from "../../../common/interfaces/auth";

class User {
    public firstName: string;
    public lastName: string;
    public email: string;
    public passwordHash: string;
    private static db: DB = new DB();

    constructor(firstName: string | null, lastName: string | null, email: string | null) {
        if (firstName && lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
        if (email) {
            this.email = email;
        }
    }

    setHashedPassword(passwordHash: string) {
        this.passwordHash = passwordHash;
    }

   static async doesUserExist(email: string) {
        return await User.db.getUserByEmail(email);
    }

    saveUser() {
        return User.db.createUser({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.passwordHash
        });
    }

    getUser(userId: string) {
        return User.db.getUserById(userId);
    }
}

export { User };
