import {Router} from "express";
import {validate} from "../../middlewares/validate";
import {CompetitionController } from "./competition.controller";
import {competitionIdParamSchema, createCompetitionSchema, updateCompetitionSchema } from "./competition.validator";

const router = Router();
const controller = new CompetitionController();

router.get("/", controller.getAllCompetitions);
router.get("/:id", validate(competitionIdParamSchema), controller.getCompetitionById);
router.post("/", validate(createCompetitionSchema), controller.createCompetition);
router.patch("/:id", validate(competitionIdParamSchema), validate(updateCompetitionSchema),
  controller.updateCompetition );
router.delete("/:id", validate(competitionIdParamSchema), controller.deleteCompetition);

export default router;

