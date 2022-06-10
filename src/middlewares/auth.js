import joi from "joi";

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
})

export async function auth(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;
    try {
        const result = signUpSchema.validate({ name, email, password, confirmPassword });
        if (result.error) {
            res.status(422).send(result.error.details[0].message);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    
    next();
}