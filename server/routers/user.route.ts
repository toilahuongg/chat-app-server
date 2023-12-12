import { UserController } from "@server/controllers/user.controller";
import { Router } from "express"
const userRouter = Router();

userRouter.get('/login', UserController.login);

export default userRouter;