import { Router } from 'express';
import { 
    broadcastToLeaders, 
    sendWelcomeEmail, 
    sendTeamRegEmail, 
    sendBuyerEmail, 
    sendAccommodationEmail, 
    sendMemberAddedEmail,
    sendTeamInviteEmail
} from './mail.controller';

const router = Router();

router.post('/send-welcome', sendWelcomeEmail);
router.post('/send-team-reg', sendTeamRegEmail);
router.post('/send-buyer', sendBuyerEmail);
router.post('/send-accommodation', sendAccommodationEmail);
router.post('/broadcast-leaders', broadcastToLeaders);
router.post('/send-member-added', sendMemberAddedEmail);
router.post("/send-team-invite", sendTeamInviteEmail);
export default router;