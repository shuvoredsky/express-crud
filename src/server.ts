
import express, { NextFunction, Request, Response } from "express"

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoute } from "./modules/user/user.route";

const app = express()
const port = config.port
app.use(express.json())

initDB()
app.get('/', logger,(req: Request ,res: Response)=>{
    res.send("Hello worlds");
})

app.use("/users", userRoute)

// app.post("/users", async (req: Request, res: Response) => {
//     const { name, email } = req.body;

//     try {
//         const result = await pool.query(
//             `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
//             [name, email]
//         );

//         return res.status(201).json({
//             success: true,
//             message: "User created successfully",
//             data: result.rows[0],
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "User creation failed",
//             error: error.message,
//         });
//     }
// });

// app.get("/users", )


app.get("/users/:id", async(req:Request, res:Response)=>{
 try{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params])
        if(result.rows.length === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
})



app.put("/users/:id", async(req:Request, res:Response)=>{
    const {name, email} = req.body;
 try{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING * `, [name, email, req.params.id])
        if(result.rows.length === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
})


app.delete("/users/:id", async(req:Request, res:Response)=>{
 try{
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id])
        if(result.rowCount === 0){
            res.status(404).json({
                 success: false,
            message: "User not found",
            })
        }else{
            res.status(200).json({
                success: true,
                message: "User delete successfully",
                data: result.rows,

            })
        }
        
 }catch(err: any){
     res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })  
 }
})


//  todos crud
app.post("/todos", async(req: Request, res:Response)=>{
    const {user_id, title} = req.body;

    try{
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title])
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
})


app.get("/todos", async(req: Request, res: Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM todos`);

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
})


app.get("/todos/:id", async(req: Request, res: Response)=>{
    try{
        const result = await pool.query(
            `SELECT * FROM todos WHERE id = $1`,
            [req.params.id]
        );

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
});


app.put("/todos/:id", async(req: Request, res: Response)=>{
    const { title, description, completed, due_date } = req.body;

    try{
        const result = await pool.query(
            `UPDATE todos 
             SET title=$1, description=$2, completed=$3, due_date=$4, updated_at=NOW()
             WHERE id=$5 RETURNING *`,
            [title, description, completed, due_date, req.params.id]
        );

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
});


app.delete("/todos/:id", async(req: Request, res: Response)=>{
    try{
        const result = await pool.query(
            `DELETE FROM todos WHERE id = $1`,
            [req.params.id]
        );

        if(result.rowCount === 0){
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });

    }catch(err:any){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



app.use((req:Request, res:Response)=>{
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.path,
    })
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})