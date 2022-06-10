import db from '../db.js';
import { nanoid } from 'nanoid';

export async function postUrls(req, res) {
    const { url } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer', '').trim()
    const shortly = nanoid(10)
    if (!token)
        return res.status(401).send(`sua sessão expirou`)
    try {
        const user = await db.query(`
            SELECT * 
            FROM sessions 
            JOIN users ON sessions."userId" = users.id 
            WHERE token = $1
        `, [token])
        if (user.rowCount === 0) return res.sendStatus(404)

        await db.query(`INSERT INTO urls ("userId",url,"shortUrl", "visitCount") VALUES($1,$2,$3, $4)`, [
            user.rows[0].id,
            url,
            shortly,
            0
        ])
        res.status(201).send({ shortUrl: shortly })
    } catch (error) {
        console.log(error)
        res.status(422).send(error)
    }
}

export async function getUrl(req, res) {
    const urlId = req.params.id
    try{
        const data = await db.query(`
            SELECT urls.id, urls."shortUrl", urls.url FROM urls WHERE urls.id = $1
        `, [urlId])
        if(data.rowCount === 0)  return res.sendStatus(404)
        res.send(data.rows[0])
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function openUrl(req, res) {
    const shortUrl = req.params.shortUrl
    try{
        const data = await db.query(`
            SELECT urls."shortUrl", urls.url FROM urls WHERE urls."shortUrl" = $1
        `, [shortUrl])
        if(data.rowCount === 0)  return res.sendStatus(404)

        await db.query(`
            UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1
        `, [shortUrl])
    
        const url = data.rows[0].url
        res.redirect(url)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function deleteUrl(req, res){
    const urlId = req.params.id
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer', '').trim()
    try{
        const owner = await db.query(`
            SELECT sessions.*
            FROM sessions WHERE token = $1
        `, [token])
        const urlExists = await db.query(`
            SELECT * FROM urls WHERE id = $1
        `, [urlId])
        if(owner.rows[0].userId != urlExists.rows[0].userId) return res.sendStatus(401)
        await db.query(`
            DELETE FROM urls WHERE id = $1
        `, [urlId])
        res.sendStatus(204)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}