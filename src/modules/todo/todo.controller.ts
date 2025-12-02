import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todoService } from "./todo.service";

const createTodo = async(req: Request, res:Response)=>{
   try{
        const result = await todoService.createTodo(req.body)
            res.status(201).json({
            success: true,
            message: "Todo created",
            data: result.rows[0]
        })
    }catch(err:any){
        res.status(500).json({
            success: false,

        })
    }
}

const getTodo = async(req: Request, res: Response)=>{
    try{
        const result = await todoService.getTodo()

        res.status(200).json({
            success: true,
            message: "todos retrieved successfully",
            data: result.rows,
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingleTodo = async(req: Request, res: Response)=>{
    try{
        const result = await todoService.getSingleTodo(req.params.id as string)

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo fetched successfully",
            data: result.rows[0],
        });

    }catch(err:any){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const updateTodo = async(req: Request, res: Response)=>{
    const { title, description, completed, due_date } = req.body;

    try{
        const result = await todoService.updateTodo(req.body)

        if(result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: result.rows[0],
        });

    }catch(err:any){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


export const todoController = {
    createTodo,
    getTodo,
    getSingleTodo,
}