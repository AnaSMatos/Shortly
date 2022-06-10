import db from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
    const {name, email, password} = req.body;
    try{
        const hash = await bcrypt.hash(password, 10);
        await db.query(`
        INSERT INTO users (name, email, password) 
        VALUES ($1, $2, $3)`, [name, email, hash]);
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signIn(req, res){
    const {email, password} = req.body;
    const token = uuid();
    try{
        const user = await db.query(`
        SELECT * FROM users WHERE email = $1`, [email]);
        if(user.rows.length === 0){
            return res.sendStatus(401);
        }else{
            const isMatch = await bcrypt.compare(password, user.rows[0].password);
            if(isMatch){
                await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id]);
                return res.send(token).sendStatus(200);
            }else{
                return res.sendStatus(401);
            }
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}