import jwt from 'jsonwebtoken';

export interface UserPayload extends jwt.JwtPayload{
    id: number;
}

export interface AdminPayload extends jwt.JwtPayload{
    id: number;
    club_id: number;
}

export interface GlobalAdminPayload extends jwt.JwtPayload{
    id: number;
    username: string;
    is_global_admin: boolean;
}

//declaring global epxress type
declare global {
    namespace Express {
        interface Request  {
            user_id: number;
            admin_user_id: number;
            admin_club_id: number;
            global_admin_id: number;
        }
    }
}