import db from "../db.js";

export async function getUsers(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const {id} = req.params
    if (!token) return res.sendStatus(401)
    try{
        const data = await db.query(`
            SELECT 
                users.id, 
                users.name, 
                urls."shortUrl", 
                urls."visitCount", 
                urls."userId",
                urls.url,
                urls.id AS "urlId"
            FROM users
            LEFT JOIN urls ON users.id = urls."userId"
            WHERE users.id = $1
        `, [id]) 

        const totalViews = await db.query(`
        SELECT SUM(urls."visitCount") AS "totalViews"
        FROM urls
        WHERE urls."userId" = $1
        `, [id])
        
        const result = data.rows;

        if(result.length === 0) return res.sendStatus(404);

        const finalAns = {
            id: result[0].id,
            name: result[0].name,
            visitCount: totalViews.rows[0].totalViews,
            shortenedUrls : result.map(url => {
                return {
                    id: url.urlId,
                    shortUrl: url.shortUrl,
                    url: url.url,
                    visitCount: url.visitCount
                }
            })
        }

        res.status(200).send(finalAns)

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}


export async function ranking(req, res){
    try{
        const data = await db.query(`
            SELECT 
                urls."userId" AS id,
                users.name,
                COUNT(urls."userId") AS "linksCount",
                SUM(urls."visitCount") AS "visitCount"
            FROM urls
            LEFT JOIN users ON users.id = urls."userId"
            GROUP BY urls."userId", users.name
            ORDER BY "visitCount" DESC
            LIMIT 10
        `)

        res.send(data.rows)
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}