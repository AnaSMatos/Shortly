import Joi from "joi";

const schema = Joi.object({
    url: Joi.string().uri().required()
})

export async function url(req, res, next){
    const { url } = req.body;
    try{
        const result = schema.validate({ url });
        if(result.error) return res.status(422).send(result.error.details[0].message);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    next();
}