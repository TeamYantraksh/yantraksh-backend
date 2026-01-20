import { Request, Response } from 'express';
import prisma from '../../config/client';
import { sendEmail } from './mail.service';
import QRCode from 'qrcode';

export const sendWelcomeEmail = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        await sendEmail(user.email, "Welcome to Tech Fest!", "welcome", { name: user.name });

        res.status(200).json({ message: "Welcome email sent successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const sendTeamRegEmail = async (req: Request, res: Response) => {
    const { teamId } = req.body;
    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { leader: true }
        });

        if (!team || !team.leader) {
            res.status(404).json({ error: "Team or Leader not found" });
            return;
        }

        const qrCode = await QRCode.toDataURL(team.id);

        await sendEmail(
            team.leader.email,
            `Team ${team.name} Registered!`,
            "teamSuccess",
            { teamName: team.name, leaderName: team.leader.name, teamId: team.id },
            [{ filename: 'team-qr.png', path: qrCode, cid: 'qrImage' }]
        );

        res.status(200).json({ message: "Team registration email sent" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const sendBuyerEmail = async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            res.status(404).json({ error: "Ticket not found" });
            return;
        }

        const qrCode = await QRCode.toDataURL(ticket.id);

        await sendEmail(
            ticket.buyerEmail,
            "Order Confirmation",
            "buyerConfirmation",
            { buyerName: ticket.buyerName },
            [{ filename: 'ticket-qr.png', path: qrCode, cid: 'qrImage' }]
        );

        res.status(200).json({ message: "Buyer email sent" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const sendAccommodationEmail = async (req: Request, res: Response) => {
    const { accommodationId } = req.body;
    try {
        const acc = await prisma.accommodation.findUnique({ where: { id: accommodationId } });
        if (!acc) {
            res.status(404).json({ error: "Accommodation not found" });
            return;
        }

        await sendEmail(
            acc.guestEmail,
            "Accommodation Confirmed",
            "accommodation",
            { guestName: acc.guestName, checkInDate: new Date(acc.checkInDate).toDateString() }
        );

        res.status(200).json({ message: "Accommodation email sent" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const broadcastToLeaders = async (req: Request, res: Response) => {
    const { message } = req.body;
    try {
        const teams = await prisma.team.findMany({
            include: { leader: true }
        });

        const sentEmails = new Set();

        for (const team of teams) {
            if (team.leader && team.leader.email && !sentEmails.has(team.leader.email)) {
                await sendEmail(
                    team.leader.email,
                    "Important Update for Leaders",
                    "leaderUpdate",
                    { leaderName: team.leader.name, message: message }
                );
                sentEmails.add(team.leader.email);
            }
        }
        res.status(200).json({ message: `Update sent to ${sentEmails.size} leaders` });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const sendMemberAddedEmail = async (req: Request, res: Response) => {
    const { teamId, memberId } = req.body;
    if (!teamId || !memberId) {
        res.status(400).json({ error: "Please provide both teamId and memberId" });
        return;
    }

    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        const member = await prisma.user.findUnique({
            where: { id: memberId }
        });

        if (!team) {
            res.status(404).json({ error: "Team not found" });
            return;
        }
        if (!member) {
            res.status(404).json({ error: "Member (User) not found" });
            return;
        }

        await sendEmail(
            member.email,
            `You have been added to Team ${team.name}`,
            "memberAdded",
            {
                memberName: member.name,
                teamName: team.name
            }
        );

        res.status(200).json({ message: "Member notification email sent successfully" });

    } catch (error: any) {
        console.error("Error sending member mail:", error);
        res.status(500).json({ error: error.message });
    }
};

export const sendTeamInviteEmail = async (req: Request, res: Response) => {
    const { teamId, memberId } = req.body;

    if (!teamId || !memberId) {
        return res.status(400).json({
            success: false,
            error: "teamId and memberId are required",
        });
    }

    try {
        const [team, member] = await Promise.all([
            prisma.team.findUnique({ where: { id: teamId } }),
            prisma.user.findUnique({ where: { id: memberId } }),
        ]);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: "Team not found",
            });
        }

        if (!member) {
            return res.status(404).json({
                success: false,
                error: "Member not found",
            });
        }

        await sendEmail(
            member.email,
            `Team Invitation: ${team.name}`,
            "teamInvite",
            {
                memberName: member.name,
                teamName: team.name,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Team invitation email sent",
        });
    } catch (error: any) {
        console.error("Error sending team invite email:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to send team invitation email",
        });
    }
};
