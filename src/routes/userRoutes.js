import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/authenticate";
import parser from "../middlewares/upload";
import validator from "../middlewares/validator";
import {
  registerValidation, loginValidation, profileValidation
} from "../validations/userValidation";

const router = Router();
const { verifyToken } = Authentication;
const {
  registerUser, loginUser, updateUserProfile, uploadPhoto
} = UserController;

router.post("/signin", validator(loginValidation), loginUser);
router.post("/signup", validator(registerValidation), registerUser);

router.patch("/profile", verifyToken, validator(profileValidation), updateUserProfile);
router.patch("/photo", verifyToken, parser.single("image"), uploadPhoto);

export default router;
