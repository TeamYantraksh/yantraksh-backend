import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { ParticipationController } from "./participation.controller";
import {
  participationIdParamSchema,
  createParticipationSchema,
  updateParticipationSchema,
} from "./participation.validator";

const router = Router();
const controller = new ParticipationController();

router.get("/", controller.getAllParticipations);
router.post("/", validate(createParticipationSchema), controller.createParticipation);
router.get("/user/:userId", controller.getParticipationsByUser);
router.get("/competition/:competitionId", controller.getParticipationsByCompetition);
router.get("/:id", validate(participationIdParamSchema), controller.getParticipationById);
router.patch("/:id", validate(participationIdParamSchema), validate(updateParticipationSchema), controller.updateParticipation );
router.delete( "/:id", validate(participationIdParamSchema), controller.deleteParticipation);

export default router;

