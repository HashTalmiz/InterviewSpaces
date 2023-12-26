
import { Router, Request, Response } from "express";

import {loginController, registerController, validateToken} from "./controllers/AuthController";
import authCheck from "./middlewares/authCheck";

const router = Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/validate', validateToken);

router.post('/protected', authCheck, (req, res) => {
    res.send({
        success: true
    });
});

export default router;