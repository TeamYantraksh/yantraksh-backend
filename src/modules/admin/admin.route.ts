import { Router } from "express";
import { requireUser } from "../../middlewares/requireUser";

import { AdminController } from "./admin.controller";
import { requireAdmin } from "../../middlewares/requireUser";

const router = Router();
const controller = new AdminController();

router.use(requireUser);
router.use(requireAdmin);

router.get("/dashboard", controller.dashboard);
router.get("/competitions", controller.getCompetitions);
router.post("/competitions", controller.createCompetition);
router.patch("/competitions/:id", controller.updateCompetition);
router.delete("/competitions/:id", controller.deleteCompetition);

export default router;
