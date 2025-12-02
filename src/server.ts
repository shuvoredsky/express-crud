
import express, { NextFunction, Request, Response } from "express"

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoute } from "./modules/user/user.route";
import { todoRoute } from "./modules/todo/todo.route";

const app = express()
const port = config.port
app.use(express.json())

initDB()
app.get('/', logger,(req: Request ,res: Response)=>{
    res.send("Hello worlds");
})

app.use("/users", userRoute)

app.use("/todos", todoRoute)




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