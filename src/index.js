import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routers/authRoute.js";
import urlsRouter from "./routers/urlsRoute.js";
import usersRouter from "./routers/usersRoute.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(authRouter)
app.use(urlsRouter)
app.use(usersRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})
