import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { requireUser, requireAdmin } from "../../middlewares/requireUser";
import { loginSchema, registerSchema } from "./auth.validator";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", requireUser, controller.me);
router.get("/verify-email", controller.verifyEmail.bind(controller));
router.get("/users", requireUser, requireAdmin, controller.getAllUsers.bind(controller));
router.patch("/users/:id/role", requireUser, requireAdmin, controller.changeUserRole.bind(controller));

export default router;
