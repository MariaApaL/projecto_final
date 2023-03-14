import { Router , Request , Response} from "express";
import userController from "../controllers/user-controller";
import { verifyToken } from '../middlewares/verifyToken';


const userRoute = Router();

userRoute.post('/login', userController.prototype.login)
userRoute.post('/register', userController.prototype.register)
userRoute.get('/getProfile', verifyToken, userController.prototype.getProfile) //Solo puedes acceder si tienes un token verificado




export default userRoute;