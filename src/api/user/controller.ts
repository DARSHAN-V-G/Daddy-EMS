import {Request, Response} from 'express'
import prisma from '../../prisma.js';
import RegisterController  from '../event/controller.js';
import {Feedback, TeamInvite} from './types.js';

const acceptTeamInviteController = async (req: Request, res: Response): Promise<void> =>{
    const user_id=req.user_id;
    const eventId = req.params.eventId;
    const Invite: TeamInvite = req.body;

    try{
        if(!eventId){
            res.status(400).json({
                message: "Requires eventId"
            })
            return;
        }
        if(!Invite.from_team_id || !Invite.to_team_id){
            res.status(400).json({
                message: "Require all fields"
            })
            return;
        }
        const {from_team_id,to_team_id} = Invite;
        const teamInvite = await prisma.invitation.findFirst({
            where: {
                from_team_id: from_team_id,
                to_team_id: to_team_id
            }
        });
        if (!teamInvite) {
            res.status(404).json({error: 'Team invite not found'});
            return;
        }
        const updatedTeamMember = await prisma.teammembers.updateMany({
            where:{
                user_id: user_id,
                team_id: to_team_id
            },
            data:{
                team_id: from_team_id,
            }
        });
        if (updatedTeamMember.count === 0) {
            await RegisterController(req, res);
        }
        res.status(200).json({
            message:"Team invite accepted."
        });
    } catch(err) {
        res.status(500).json({
            message: err
        });
        return;
    }
};

const rejectTeamInviteController = async (req: Request ,res:Response) :Promise<void>=>{
    const user_id=req.user_id;
    const Invite: TeamInvite = req.body;
    const {from_team_id,to_team_id} = Invite;
    try{
        const teamInvite = await prisma.invitation.findFirst({
            where: {
                from_team_id: from_team_id,
                to_team_id: to_team_id
            }
        });
        if(!teamInvite){
            res.status(404).json({error: 'Team invite not found'});
            return;
        }
        const inviteDeleted = await prisma.invitation.delete({
            where:{
                id: teamInvite.id
            }
        });
        res.status(200).json({
            message:"Team invite rejected."
        })
    }catch(err){
        res.status(500).json({
            message:err
        })
    }
}

const feedbackController = async (req: Request, res: Response): Promise<void> =>{
    try{
        const userFeedback: Feedback = req.body;
        const user_id = req.user_id;
        const feedbackdata = await prisma.feedback.create({
            data:{
                user_id: user_id,
                event_id: userFeedback.event_id,
                feedback: userFeedback.feedback,
                rating: userFeedback.rating,
            }
        });
        res.status(201).json({
            message: "Feedback saved successfully"
        });
        return;
    }
    catch(err){
        res.status(500).json({
            message: err
        });
        return;
    }
}

export {acceptTeamInviteController, rejectTeamInviteController, feedbackController};