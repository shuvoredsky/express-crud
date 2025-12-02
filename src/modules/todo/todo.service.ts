import { pool } from "../../config/db"

const createTodo = async(payload: Record<string, unknown>)=>{
    const {user_id, title} = payload;
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title])
    return result;
}

const getTodo = async()=>{
    const result = await pool.query(`SELECT * FROM todos`)
    return result;
}

const getSingleTodo = async(id:string)=>{
    const result = await pool.query(
            `SELECT * FROM todos WHERE id = $1`,
            [id])
            return result
}


const updateTodo = async(payload: Record<string, unknown>)=>{
    const {title, description, completed, due_date, id} = payload;
    const result = await pool.query(
            `UPDATE todos 
             SET title=$1, description=$2, completed=$3, due_date=$4, updated_at=NOW()
             WHERE id=$5 RETURNING *`,
            [title, description, completed, due_date, id]
        );

        return result;
}


const deleteTodo = async(id: string)=>{
    const result = await pool.query(
            `DELETE FROM todos WHERE id = $1`,
            [id]
    )
    return result;
}

export const todoService = {
    createTodo,
    getTodo,
    getSingleTodo,
    updateTodo,
    deleteTodo,

}