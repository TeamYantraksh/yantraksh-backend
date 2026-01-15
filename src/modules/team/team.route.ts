import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { TeamController } from "./team.controller";
import {
  teamIdParamSchema,
  teamIdAndUserIdParamSchema,
  competitionIdParamSchema,
  leaderIdParamSchema,
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema,
  teamIdParamOnlySchema,
} from "./team.validator";

const router = Router();
const controller = new TeamController();

router.post("/", validate(createTeamSchema), controller.createTeam);
router.get("/", controller.getAllTeams);
router.get("/:id", validate(teamIdParamSchema), controller.getTeamById);
router.patch("/:id", validate(teamIdParamSchema), validate(updateTeamSchema), controller.updateTeam);
router.delete("/:id", validate(teamIdParamSchema), controller.deleteTeam);
router.get( "/competition/:competitionId", validate(competitionIdParamSchema), controller.getTeamsByCompetition);
router.get( "/leader/:leaderId", validate(leaderIdParamSchema), controller.getTeamsByLeader);
router.post( "/:teamId/members", validate(teamIdParamOnlySchema), validate(addTeamMemberSchema), controller.addTeamMember);
router.get( "/:teamId/members", validate(teamIdParamOnlySchema), controller.getTeamMembers);
router.delete( "/:teamId/members/:userId", validate(teamIdAndUserIdParamSchema), controller.removeTeamMember);

export default router;
