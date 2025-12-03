import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async(req: Request, res:Response)=>{
    const {email, password} = req.body;

    try {
           const result = await authServices.loginUser(email, password)
    
            return res.status(200).json({
                success: true,
                message: "Login successfully",
                data: result,
            });
    
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "login failed",
                error: error.message,
            });
        }

}

export const authController = {
    loginUser,
}