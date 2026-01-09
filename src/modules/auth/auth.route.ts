import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { requireUser } from "../../middlewares/requireUser";
import { loginSchema, registerSchema } from "./auth.validator";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", requireUser, controller.me);

export default router;
